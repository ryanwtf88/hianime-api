import * as cheerio from 'cheerio';

export const extractWatch2gether = (html) => {
    const $ = cheerio.load(html);
    const rooms = [];

    $('.flw-item').each((i, el) => {
        const obj = {
            id: null,
            title: null,
            poster: null,
            episodes: {
                sub: null,
                dub: null,
            },
        };

        const link = $(el).find('.film-name .dynamic-name').attr('href');
        obj.id = link?.split('/').pop() || null;
        obj.title = $(el).find('.film-name .dynamic-name').text().trim();
        obj.poster = $(el).find('.film-poster img').attr('data-src');
        obj.episodes.sub = Number($(el).find('.tick-sub').text()) || null;
        obj.episodes.dub = Number($(el).find('.tick-dub').text()) || null;

        rooms.push(obj);
    });

    return { rooms };
};
