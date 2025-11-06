// Node.js compatible server entry point
import { serve } from '@hono/node-server';
import app from './src/app.js';

const PORT = process.env.PORT || 5000;

serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`server is running at http://0.0.0.0:${PORT}`);
console.log(`docs: http://0.0.0.0:${PORT}/docs`);
console.log(`swagger: http://0.0.0.0:${PORT}/ui`);
