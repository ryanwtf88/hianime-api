import { Hono } from 'hono';

const proxyController = async (c) => {
    const url = c.req.query('url');
    const referer = c.req.query('referer');

    if (!url) {
        return c.text('URL is required', 400);
    }

    try {
        // Get range header from incoming request
        const rangeHeader = c.req.header('range');
        
        // Build fetch headers
        const fetchHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': referer || 'https://megacloud.tv',
            'Origin': referer || 'https://megacloud.tv',
            'Accept': '*/*',
        };

        // Forward range header if present
        if (rangeHeader) {
            fetchHeaders['Range'] = rangeHeader;
        }

        const response = await fetch(url, {
            headers: fetchHeaders,
        });

        if (!response.ok) {
            console.error(`Upstream error for ${url}: ${response.status}`);
            return c.text(`Upstream error: ${response.status}`, response.status);
        }

        const contentType = response.headers.get('content-type') || 'application/vnd.apple.mpegurl';

        // Add CORS headers
        c.header('Access-Control-Allow-Origin', '*');
        c.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        c.header('Access-Control-Allow-Headers', 'Range, Content-Type, Accept, Accept-Encoding');
        c.header('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges, Cache-Control');
        c.header('Content-Type', contentType);

        // Forward important headers
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
            c.header('Content-Length', contentLength);
        }

        const contentRange = response.headers.get('content-range');
        if (contentRange) {
            c.header('Content-Range', contentRange);
        }

        const acceptRanges = response.headers.get('accept-ranges');
        if (acceptRanges) {
            c.header('Accept-Ranges', acceptRanges);
        } else {
            c.header('Accept-Ranges', 'bytes');
        }

        // Cache control for media segments
        if (url.endsWith('.ts') || url.endsWith('.m4s')) {
            c.header('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (url.endsWith('.m3u8')) {
            c.header('Cache-Control', 'no-cache');
        }

        // If it's an M3U8 playlist, we need to rewrite the internal URLs
        if (contentType.includes('mpegurl') || url.endsWith('.m3u8')) {
            const content = await response.text();

            // Resolve base URL for relative paths
            const basePath = url.substring(0, url.lastIndexOf('/') + 1);

            // Rewrite URLs
            const lines = content.split('\n');
            const newLines = lines.map(line => {
                line = line.trim();
                if (!line || line.startsWith('#')) return line; // Skip comments/empty

                let targetUrl = line;
                if (!line.startsWith('http')) {
                    targetUrl = basePath + line;
                }

                // Encode the target URL properly
                const encodedUrl = encodeURIComponent(targetUrl);
                const encodedReferer = encodeURIComponent(referer || 'https://megacloud.tv');

                // Construct proxy URL (point back to this same endpoint)
                const proxyPath = c.req.path;

                return `${proxyPath}?url=${encodedUrl}&referer=${encodedReferer}`;
            });

            const newContent = newLines.join('\n');
            return c.text(newContent);
        }

        // For TS segments or other binary data, return the stream directly
        // Set proper status for range requests
        if (response.status === 206 || contentRange) {
            c.status(206);
        }
        
        return c.body(response.body);

    } catch (error) {
        console.error(`Proxy Error for ${url}:`, error.message);
        return c.text(`Proxy Error: ${error.message}`, 500);
    }
};

export default proxyController;
