// Vercel Serverless Function Handler
import app from '../src/app.js';

// Vercel serverless handler
export default async function handler(req, res) {
  try {
    // Build the full URL
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const url = `${protocol}://${host}${req.url}`;

    // Create a Web API Request from the Node.js request
    const webRequest = new Request(url, {
      method: req.method,
      headers: new Headers(req.headers),
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    // Get response from Hono app
    const webResponse = await app.fetch(webRequest);

    // Set response status
    res.status(webResponse.status);

    // Copy headers from Web Response to Node.js response
    webResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send the response body
    const body = await webResponse.text();
    res.send(body);
  } catch (error) {
    console.error('Vercel handler error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message,
    });
  }
}
