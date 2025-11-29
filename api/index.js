import app from '../src/app.js';

export default async function handler(req, res) {
  try {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const url = `${protocol}://${host}${req.url}`;
    const webRequest = new Request(url, {
      method: req.method,
      headers: new Headers(req.headers),
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const webResponse = await app.fetch(webRequest);
    res.status(webResponse.status);
    webResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

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
