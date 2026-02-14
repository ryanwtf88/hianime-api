/**
 * Cloudflare Workers entry point for HiAnime API
 *
 * This file adapts the Hono app to work with Cloudflare Workers.
 * It handles incoming requests and routes them through the main app.
 */

import app from './src/app.js';

export default {
  async fetch(request, env, ctx) {
    return app.fetch(request, env, ctx);
  },
};
