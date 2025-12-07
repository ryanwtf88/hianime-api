import { Hono } from 'hono';

const m3u8ProxyController = async (c) => {
    const url = c.req.query('url');

    if (!url) {
        return c.text('URL is required', 400);
    }

    try {
        console.log(`[M3U8 Proxy] Fetching: ${url.substring(0, 100)}...`);

        // Fetch the M3U8 manifest directly
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://megacloud.tv/',
                'Origin': 'https://megacloud.tv',
                'Accept': '*/*',
            },
        });

        if (!response.ok) {
            console.error(`[M3U8 Proxy] Upstream error: ${response.status}`);
            return c.text(`Upstream error: ${response.status}`, response.status);
        }

        const contentType = response.headers.get('content-type') || 'application/vnd.apple.mpegurl';
        const content = await response.text();

        // Resolve base URL for relative paths
        const basePath = url.substring(0, url.lastIndexOf('/') + 1);

        // Rewrite URLs in the M3U8 to be direct (not proxied)
        // This allows the browser to fetch segments directly from CDN
        const lines = content.split('\n');
        const newLines = lines.map(line => {
            line = line.trim();
            if (!line || line.startsWith('#')) return line;

            let targetUrl = line;
            if (!line.startsWith('http')) {
                targetUrl = basePath + line;
            }

            // Return direct URL - browser can access CDN directly
            return targetUrl;
        });

        const newContent = newLines.join('\n');

        // Add CORS headers
        c.header('Access-Control-Allow-Origin', '*');
        c.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        c.header('Access-Control-Allow-Headers', 'Range, Content-Type, Accept');
        c.header('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
        c.header('Content-Type', contentType);
        c.header('Cache-Control', 'no-cache');

        console.log(`[M3U8 Proxy] Successfully fetched and rewrote M3U8 (${newContent.length} bytes)`);

        return c.text(newContent);

    } catch (error) {
        console.error(`[M3U8 Proxy] Error: ${error.message}`);
        return c.text(`Proxy Error: ${error.message}`, 500);
    }
};

export default m3u8ProxyController;
