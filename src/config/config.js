const config = {
  // Primary base URLs
  baseurl: process.env.BASE_URL || 'https://hianime.do',
  baseurl_v2: process.env.BASE_URL_V2 || 'https://kaido.to',
  
  // Streaming providers
  providers: {
    megacloud: 'https://megacloud.club',
    megaplay: 'https://megaplay.buzz',
    vidwish: 'https://vidwish.live',
    streamwish: 'https://streamwish.to',
    filemoon: 'https://filemoon.sx',
    mp4upload: 'https://www.mp4upload.com',
  },

  // Request configuration
  headers: {
    'User-Agent': process.env.USER_AGENT || 
      'Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0',
  },

  // Timeouts (in milliseconds)
  timeout: {
    default: parseInt(process.env.REQUEST_TIMEOUT) || 10000,
    stream: parseInt(process.env.STREAM_TIMEOUT) || 15000,
    extraction: parseInt(process.env.EXTRACTION_TIMEOUT) || 20000,
  },

  // Retry configuration
  retry: {
    maxAttempts: parseInt(process.env.MAX_RETRY_ATTEMPTS) || 3,
    baseDelay: parseInt(process.env.RETRY_BASE_DELAY) || 1000,
  },

  // Cache configuration
  cache: {
    enabled: process.env.CACHE_ENABLED !== 'false',
    ttl: {
      homepage: parseInt(process.env.CACHE_TTL_HOMEPAGE) || 60 * 60 * 24, // 24 hours
      search: parseInt(process.env.CACHE_TTL_SEARCH) || 60 * 60, // 1 hour
      anime: parseInt(process.env.CACHE_TTL_ANIME) || 60 * 60 * 6, // 6 hours
      episode: parseInt(process.env.CACHE_TTL_EPISODE) || 60 * 30, // 30 minutes
    },
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
    limit: parseInt(process.env.RATE_LIMIT_LIMIT) || 100, // 100 requests per window
  },

  // Feature flags
  features: {
    enableFallback: process.env.ENABLE_FALLBACK !== 'false',
    enableRetry: process.env.ENABLE_RETRY !== 'false',
    enableCache: process.env.ENABLE_CACHE !== 'false',
  },
};

export default config;

