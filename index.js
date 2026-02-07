#!/usr/bin/env bun
import app from './src/app.js';
import config from './src/config/config.js';
import { clearAllCache } from './src/utils/redis.js';

const PORT = config.port;

Bun.serve({
  port: PORT,
  hostname: '0.0.0.0',
  fetch: app.fetch,
});

console.log(`server is running at http://0.0.0.0:${PORT}`);
console.log(`docs: http://0.0.0.0:${PORT}/docs`);
console.log(`swagger: http://0.0.0.0:${PORT}`);

// Cache clear interval: 24-72 hours (using 48 hours as default)
const CACHE_CLEAR_INTERVAL = 48 * 60 * 60 * 1000; // 48 hours in milliseconds

setInterval(async () => {
  console.log('Running scheduled cache clear...');
  await clearAllCache();
}, CACHE_CLEAR_INTERVAL);

console.log(`Cache auto-clear every 48 hours`);
