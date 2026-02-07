import axios from 'axios';
import { validationError } from '../utils/errors.js';
import { extractWatch2getherPlayer } from '../extractor/extractWatch2getherPlayer.js';
import { withCache } from '../utils/redis.js';
import config from '../config/config.js';
import { extractEpisodes } from '../extractor/extractEpisodes.js';

const watch2getherPlayerController = async (c) => {
    const roomId = c.req.param('id');
    const server = c.req.query('server') || 'hd-2';

    if (!roomId) {
        throw new validationError('Room ID is required');
    }

    return await withCache(
        `watch2gether-player-${roomId}-${server}`,
        async () => {
            console.log(`Fetching watch2gether room ${roomId}...`);

            try {
                // Fetch the room page
                const response = await axios.get(`${config.baseurl}/watch2gether/${roomId}`, {
                    headers: config.headers,
                });

                if (!response.data) {
                    throw new validationError('Failed to fetch watch2gether room');
                }

                const roomData = extractWatch2getherPlayer(response.data);

                if (!roomData.animeId) {
                    throw new validationError('Could not extract anime ID from room. The room may not have started yet or the anime information is not available.');
                }

                if (!roomData.episode) {
                    throw new validationError('Could not extract episode number from room');
                }

                // Fetch episodes to find the episode ID
                console.log(`Fetching episodes for anime ${roomData.animeId}...`);
                const episodesResponse = await axios.get(
                    `${config.baseurl}/ajax/v2/episode/list/${roomData.animeId.split('-').pop()}`,
                    {
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'Referer': `${config.baseurl}/${roomData.animeId}`,
                            ...config.headers,
                        },
                    }
                );

                if (!episodesResponse.data || !episodesResponse.data.html) {
                    throw new validationError('Failed to fetch episodes');
                }

                const episodes = extractEpisodes(episodesResponse.data.html);
                
                if (!episodes || episodes.length === 0) {
                    throw new validationError('No episodes found');
                }

                // Find the matching episode
                const episodeNumber = parseInt(roomData.episode);
                const matchingEpisode = episodes.find(ep => ep.episodeNumber === episodeNumber);

                if (!matchingEpisode) {
                    throw new validationError(`Episode ${episodeNumber} not found`);
                }

                // Get the base URL from the request
                const protocol = c.req.header('x-forwarded-proto') || 'http';
                const host = c.req.header('host') || 'localhost:5000';
                const baseUrl = `${protocol}://${host}`;

                // Extract just the episode ID part
                const episodeId = matchingEpisode.id.split('::ep=')[1] || matchingEpisode.id;
                
                // Build embed URL
                const embedUrl = `${baseUrl}/api/v1/embed/${server}/${episodeId}/${roomData.type}`;

                // Return JSON data
                return {
                    roomId: roomData.roomId,
                    roomTitle: roomData.roomTitle,
                    animeId: roomData.animeId,
                    animeTitle: roomData.animeTitle,
                    episode: episodeNumber,
                    episodeId: episodeId,
                    type: roomData.type,
                    server: server,
                    embedUrl: embedUrl,
                    createdBy: roomData.createdBy,
                    status: roomData.status,
                };
            } catch (error) {
                console.error('Watch2gether player fetch failed:', error.message);
                throw new validationError(error.message);
            }
        },
        60 * 5 // 5 minutes cache
    );
};

export default watch2getherPlayerController;
