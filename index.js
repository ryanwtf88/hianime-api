#!/usr/bin/env bun
import app from './src/app.js';
import { clearAllCache } from './src/utils/redis.js';

const PORT = process.env.PORT || 3000;

Bun.serve({
  port: PORT,
  hostname: '0.0.0.0',
  fetch: app.fetch,
});

console.log(`server is running at http://0.0.0.0:${PORT}`);
console.log(`docs: http://0.0.0.0:${PORT}/docs`);
console.log(`swagger: http://0.0.0.0:${PORT}`);
const CACHE_CLEAR_INTERVAL = 30 * 60 * 1000;

setInterval(async () => {
  console.log('Running scheduled cache clear...');
  await clearAllCache();
}, CACHE_CLEAR_INTERVAL);

console.log(`Cache auto-clear every 30 minutes`);
