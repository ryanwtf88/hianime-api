const config = {
  baseurl: 'https://hianime.to',
  baseurl_v2: 'https://aniwatchtv.to',
  providers: {
    megacloud: 'https://megacloud.club',
    megaplay: 'https://megaplay.buzz',
    vidwish: 'https://vidwish.live',
    streamwish: 'https://streamwish.to',
  },

rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
    limit: parseInt(process.env.RATE_LIMIT_LIMIT),
  },

  headers: {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0',
  },
};
export default config;
