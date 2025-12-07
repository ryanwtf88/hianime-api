const getEnv = (key, defaultValue = '') => {
  if (typeof globalThis.CLOUDFLARE_ENV !== 'undefined') {
    return globalThis.CLOUDFLARE_ENV[key] || defaultValue;
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
};

const config = {
  baseurl: getEnv('HIANIME_BASE_URL', 'https://hianime.to'),
  baseurl_v2: getEnv('HIANIME_BASE_URL_V2', 'https://aniwatchtv.to'),
  baseUrl: getEnv('BASE_URL', 'https://api.animo.qzz.io'),
  origin: getEnv('ORIGIN', '*'),
  port: parseInt(getEnv('PORT', '5000')),

  apiVersion: 'v1',

  documentation: {
    githubUrl: 'https://github.com/ryanwtf88/hianime-api/blob/main/README.md',
  },

  redis: {
    url: getEnv('UPSTASH_REDIS_REST_URL', 'https://easy-dassie-30340.upstash.io'),
    token: getEnv('UPSTASH_REDIS_REST_TOKEN', 'AXaEAAIncDJlNTY5YWM4NWQ5ZGE0Mzg1YTljY2ZiOThiZTA3YzE0MHAyMzAzNDA'),
    enabled: true,
  },

  providers: {
    megacloud: getEnv('MEGACLOUD_URL', 'https://megacloud.blog'),
    megaplay: getEnv('MEGAPLAY_URL', 'https://megaplay.buzz'),
    vidwish: getEnv('VIDWISH_URL', 'https://vidwish.live'),
  },

  rateLimit: {
    windowMs: parseInt(getEnv('RATE_LIMIT_WINDOW_MS', '60000')),
    limit: parseInt(getEnv('RATE_LIMIT_LIMIT', '1000000000')),
    enabled: getEnv('RATE_LIMIT_ENABLED', 'true') !== 'false',
  },

  headers: {
    'User-Agent': getEnv('USER_AGENT', 'Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0'),
  },

  logLevel: getEnv('LOG_LEVEL', 'INFO').toUpperCase(),
  enableLogging: getEnv('ENABLE_LOGGING', 'false') === 'true',

  isProduction: getEnv('NODE_ENV', 'production') === 'production',
  isDevelopment: getEnv('NODE_ENV', '') === 'development',
  isCloudflare: true,
};

export default config;
