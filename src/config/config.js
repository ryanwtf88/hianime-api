const config = {
  baseurl: process.env.HIANIME_BASE_URL || 'https://hianime.to',
  baseurl_v2: process.env.HIANIME_BASE_URL_V2 || 'https://aniwatchtv.to',
  baseUrl: process.env.BASE_URL || 'https://api-animo.vercel.app',
  origin: process.env.ORIGIN || '*',
  port: process.env.PORT || 5000,

  apiVersion: 'v1',

  documentation: {
    githubUrl: 'https://github.com/ryanwtf88/hianime-api/blob/main/README.md',
  },

  redis: {
    url: process.env.UPSTASH_REDIS_REST_URL || 'https://easy-dassie-30340.upstash.io',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AXaEAAIncDJlNTY5YWM4NWQ5ZGE0Mzg1YTljY2ZiOThiZTA3YzE0MHAyMzAzNDA',
    enabled: true,
  },

  providers: {
    megacloud: process.env.MEGACLOUD_URL || 'https://megacloud.blog',
    megaplay: process.env.MEGAPLAY_URL || 'https://megaplay.buzz',
    vidwish: process.env.VIDWISH_URL || 'https://vidwish.live',

  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    limit: parseInt(process.env.RATE_LIMIT_LIMIT) || 1000000000,
    enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
  },

  headers: {
    'User-Agent': process.env.USER_AGENT || 'Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0',
  },

  logLevel: process.env.LOG_LEVEL?.toUpperCase() || 'INFO',
  enableLogging: process.env.ENABLE_LOGGING === 'true',

  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isVercel: Boolean(process.env.VERCEL),
};

export default config;
