import app from './app.js';

export default {
  async fetch(request, env, ctx) {
    globalThis.CLOUDFLARE_ENV = env;
    globalThis.CLOUDFLARE_CTX = ctx;
    
    return app.fetch(request, env, ctx);
  },
};
