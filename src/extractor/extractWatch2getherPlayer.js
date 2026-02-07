import * as cheerio from 'cheerio';

export const extractWatch2getherPlayer = (html) => {
    const $ = cheerio.load(html);

    const roomData = {
        roomId: null,
        roomTitle: null,
        animeTitle: null,
        animeId: null,
        episode: null,
        type: null,
        status: null,
        airTime: null,
        createdBy: null,
    };

    // Extract room ID from player-wrapper
    const playerWrapper = $('#player-wrapper');
    roomData.roomId = playerWrapper.attr('data-id') || null;
    roomData.airTime = playerWrapper.attr('data-air-time') || null;
    roomData.status = playerWrapper.attr('data-status') || null;

    // Extract room title
    roomData.roomTitle = $('.rd-room-name span').text().trim() || null;

    // Extract anime title
    roomData.animeTitle = $('.rd-anime strong').text().trim() || null;

    // Extract episode number
    const episodeText = $('#episode-number').text().trim();
    roomData.episode = episodeText || null;

    // Extract type (sub/dub)
    const tickSub = $('.tick-sub').length > 0;
    const tickDub = $('.tick-dub').length > 0;
    roomData.type = tickSub ? 'sub' : (tickDub ? 'dub' : 'sub');

    // Extract created by
    roomData.createdBy = $('.username').text().trim() || null;

    // Extract anime ID from meta tags or links
    // Check og:url meta tag
    const ogUrl = $('meta[property="og:url"]').attr('content');
    if (ogUrl) {
        const urlMatch = ogUrl.match(/watch2gether\/(\d+)/);
        if (urlMatch) {
            roomData.roomId = urlMatch[1];
        }
    }

    // Look for anime ID in the page - check all links
    $('a[href]').each((i, el) => {
        const href = $(el).attr('href');
        // Match pattern like /anime-name-12345 or /watch/anime-name-12345
        if (href && href.match(/\/(?:watch\/)?([a-z0-9-]+-\d+)(?:\?|$)/)) {
            const match = href.match(/\/(?:watch\/)?([a-z0-9-]+-\d+)(?:\?|$)/);
            if (match && match[1] && !match[1].includes('watch2gether')) {
                roomData.animeId = match[1];
                return false; // Break the loop
            }
        }
    });

    // If still no anime ID, try to extract from the page title or description
    if (!roomData.animeId && roomData.animeTitle) {
        // Try to find it in meta description or keywords
        const metaDesc = $('meta[name="description"]').attr('content');
        if (metaDesc) {
            const match = metaDesc.match(/([a-z0-9-]+-\d+)/);
            if (match) {
                roomData.animeId = match[1];
            }
        }
    }

    return roomData;
};
