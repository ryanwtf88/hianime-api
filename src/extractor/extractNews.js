import * as cheerio from 'cheerio';

export const extractNews = (html) => {
    const $ = cheerio.load(html);
    const news = [];

    $('.zr-news-list .item').each((i, el) => {
        const obj = {
            id: null,
            title: null,
            description: null,
            thumbnail: null,
            uploadedAt: null,
        };

        const link = $(el).find('.zrn-title').attr('href');
        obj.id = link?.split('/').pop() || null;
        obj.title = $(el).find('.news-title').text().trim();
        obj.description = $(el).find('.description').text().trim();
        obj.thumbnail = $(el).find('.zrn-image').attr('src');
        obj.uploadedAt = $(el).find('.time-posted').text().trim();

        news.push(obj);
    });

    return { news };
};
