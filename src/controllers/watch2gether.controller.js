import axios from 'axios';
import { validationError } from '../utils/errors.js';
import { extractWatch2gether } from '../extractor/extractWatch2gether.js';
import { withCache } from '../utils/redis.js';
import config from '../config/config.js';

const VALID_ROOM_FILTERS = ['all', 'on_air', 'scheduled', 'waiting', 'ended'];

const watch2getherController = async (c) => {
    const room = c.req.query('room') || 'all';

    // Validate room parameter
    if (!VALID_ROOM_FILTERS.includes(room)) {
        throw new validationError(
            `Invalid room filter. Must be one of: ${VALID_ROOM_FILTERS.join(', ')}`
        );
    }

    return await withCache(
        `watch2gether-${room}`,
        async () => {
            console.log(`Fetching watch2gether rooms (${room}) from AJAX API...`);

            try {
                const response = await axios.get(`${config.baseurl}/ajax/watch2gether/list`, {
                    params: { room },
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Referer': `${config.baseurl}/watch2gether`,
                    },
                });

                if (!response.data || !response.data.status) {
                    throw new validationError('Failed to fetch watch2gether data');
                }

                const roomsData = extractWatch2gether(response.data.html);

                // Add player URLs to each room
                const protocol = c.req.header('x-forwarded-proto') || 'http';
                const host = c.req.header('host') || 'localhost:5000';
                const baseUrl = `${protocol}://${host}`;

                roomsData.rooms = roomsData.rooms.map(room => ({
                    ...room,
                    playerUrl: `${baseUrl}/api/v1/watch2gether/player/${room.id}`,
                }));

                return roomsData;
            } catch (error) {
                console.error('Watch2gether fetch failed:', error.message);
                throw new validationError(error.message);
            }
        },
        60 * 5 // 5 minutes cache
    );
};

export default watch2getherController;
