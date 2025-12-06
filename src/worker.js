import app from './app.js';

// Cloudflare Workers entry point
export default {
  async fetch(request, env, ctx) {
    // Make environment variables available globally
    globalThis.CLOUDFLARE_ENV = env;
    globalThis.CLOUDFLARE_CTX = ctx;
    
    return app.fetch(request, env, ctx);
  },
};
