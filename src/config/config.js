// Load environment variables
const config = {
  // Base URLs
  baseurl: process.env.HIANIME_BASE_URL || 'https://hianime.to',
  baseurl_v2: process.env.HIANIME_BASE_URL_V2 || 'https://aniwatchtv.to',
  
  // API Configuration
  baseUrl: process.env.BASE_URL || '',
  origin: process.env.ORIGIN || '*',
  port: process.env.PORT || 5000,
  
  // Redis/Upstash Configuration
  redis: {
    url: process.env.UPSTASH_REDIS_REST_URL || 'https://easy-dassie-30340.upstash.io',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AXaEAAIncDJlNTY5YWM4NWQ5ZGE0Mzg1YTljY2ZiOThiZTA3YzE0MHAyMzAzNDA',
    enabled: true, // Always enabled with hardcoded credentials
  },
  
  // External Providers
  providers: {
    megacloud: process.env.MEGACLOUD_URL || 'https://megacloud.club',
    megaplay: process.env.MEGAPLAY_URL || 'https://megaplay.buzz',
    vidwish: process.env.VIDWISH_URL || 'https://vidwish.live',
    streamwish: process.env.STREAMWISH_URL || 'https://streamwish.to',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // Default: 1 minute
    limit: parseInt(process.env.RATE_LIMIT_LIMIT) || 100, // Default: 100 requests per window
    enabled: process.env.RATE_LIMIT_ENABLED !== 'false', // Default: enabled
  },

  // HTTP Headers
  headers: {
    'User-Agent': process.env.USER_AGENT || 'Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0',
  },
  
  // Environment
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isVercel: Boolean(process.env.VERCEL),
};

export default config;
