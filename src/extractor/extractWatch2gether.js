import * as cheerio from 'cheerio';

export const extractWatch2gether = (html) => {
    const $ = cheerio.load(html);
    const rooms = [];

    $('.live-item').each((i, el) => {
        const obj = {
            id: null,
            animeId: null,
            animeTitle: null,
            roomTitle: null,
            poster: null,
            episode: null,
            type: null,
            status: null,
            createdBy: null,
            createdAt: null,
        };

        obj.id = $(el).attr('data-id');
        const link = $(el).find('.live-thumbnail').attr('href');
        obj.animeId = link?.split('/').pop() || null;

        obj.animeTitle = $(el).find('.anime-name').text().trim();
        obj.roomTitle = $(el).find('.live-name a').text().trim();
        obj.poster = $(el).find('.live-thumbnail-img').attr('src');
        obj.episode = $(el).find('.live-tick-eps').text().trim();
        obj.type = $(el).find('.live-tick-type').text().trim();

        const statusEl = $(el).find('.live-tick-pending');
        obj.status = statusEl.length ? statusEl.text().trim() : 'On-air';

        obj.createdBy = $(el).find('.uc-info strong').text().trim();
        obj.createdAt = $(el).find('.uc-info .time').text().trim();

        rooms.push(obj);
    });

    return { rooms };
};
