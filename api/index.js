// Vercel Serverless Function Handler
import app from '../src/app.js';

// Export the Hono app's fetch handler directly
// Hono's fetch is compatible with Vercel's serverless functions
export default app.fetch.bind(app);
