import { Hono } from 'hono';

const proxyController = async (c) => {
    const url = c.req.query('url');
    const referer = c.req.query('referer');

    if (!url) {
        return c.text('URL is required', 400);
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': referer || 'https://megacloud.tv',
            },
        });

        if (!response.ok) {
            throw new Error(`Upstream error: ${response.status}`);
        }

        const contentType = response.headers.get('content-type') || 'application/vnd.apple.mpegurl';

        // Add CORS headers
        c.header('Access-Control-Allow-Origin', '*');
        c.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        c.header('Access-Control-Allow-Headers', 'Range, Content-Type');
        c.header('Content-Type', contentType);

        // Copy range headers if present (for seeking)
        const rangeHeader = response.headers.get('content-range');
        if (rangeHeader) {
            c.header('Content-Range', rangeHeader);
        }

        const acceptRanges = response.headers.get('accept-ranges');
        if (acceptRanges) {
            c.header('Accept-Ranges', acceptRanges);
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

                // Construct proxy URL with absolute path for Vercel compatibility
                return `/api/v1/proxy?url=${encodedUrl}&referer=${encodedReferer}`;
            });

            const newContent = newLines.join('\n');
            return c.text(newContent);
        }

        // For TS segments or other binary data, return as arrayBuffer
        const arrayBuffer = await response.arrayBuffer();
        return c.body(arrayBuffer);

    } catch (error) {
        console.error(`Proxy Error for ${url}:`, error.message);
        return c.text(`Proxy Error: ${error.message}`, 500);
    }
};

export default proxyController;
