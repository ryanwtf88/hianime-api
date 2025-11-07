// Vercel Serverless Function Handler
// This file serves as the entry point for Vercel serverless deployment

import app from '../src/app.js';

// Export the Hono app as a serverless function
export default app.fetch;
