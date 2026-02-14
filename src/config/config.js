const config = {
  // HiAnime source URL
  baseurl: 'https://hianime.to',

  baseurl2: 'https://aniwatchtv.to',

  // CORS origin (* for all, or comma-separated URLs)
  origin: '*',

  // Server port (used for local/Docker deployments)
  port: 3030,

  // External proxy URL for streaming
  proxyUrl: 'https://xeanimeproxy.howtoopengemail.workers.dev',

  // Redis configuration (leave empty to disable caching)
  redis: {
    url: '',
    token: '',
    enabled: false,
  },

  // External provider URLs
  providers: {
    megacloud: 'https://megacloud.blog',
  },

  // Rate limiting settings
  // Note: Disable for Cloudflare Workers (use Cloudflare's built-in rate limiting instead)
  rateLimit: {
    windowMs: 60000, // 1 minute
    limit: 1000000000, // requests per window
    enabled: true, // Set to true for local/Vercel, false for Cloudflare Workers
  },

  // HTTP headers
  headers: {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0',
  },

  // Logging settings
  logLevel: 'INFO',
  enableLogging: false,

  // Environment detection
  isProduction: true,
  isDevelopment: false,
  isVercel: true, // Set to true if deploying to Vercel
};

export default config;
