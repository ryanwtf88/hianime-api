import { Hono } from 'hono';

const m3u8ProxyController = async (c) => {
    const url = c.req.query('url');

    if (!url) {
        return c.text('URL is required', 400);
    }

    try {
        console.log(`[M3U8 Proxy] Request for: ${url.substring(0, 80)}...`);

        // Since CDN blocks Cloudflare Workers IPs, redirect browser to fetch directly
        // This maintains compatibility with frontends expecting a proxy endpoint
        // but lets the browser handle the actual CDN request
        
        // Return a minimal M3U8 that redirects to the direct URL
        const redirectM3u8 = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=1000000
${url}
`;

        // Add CORS headers
        c.header('Access-Control-Allow-Origin', '*');
        c.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        c.header('Access-Control-Allow-Headers', 'Range, Content-Type, Accept');
        c.header('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
        c.header('Content-Type', 'application/vnd.apple.mpegurl');
        c.header('Cache-Control', 'no-cache');

        console.log(`[M3U8 Proxy] Returning redirect to direct URL`);

        return c.text(redirectM3u8);

    } catch (error) {
        console.error(`[M3U8 Proxy] Error: ${error.message}`);
        return c.text(`Proxy Error: ${error.message}`, 500);
    }
};

export default m3u8ProxyController;
