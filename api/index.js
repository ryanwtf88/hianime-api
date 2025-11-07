// Vercel Serverless Function Handler
import app from '../src/app.js';
import { handle } from 'hono/vercel';

// Export Hono app with Vercel adapter
export default handle(app);
