// Vercel-specific proxy for HLS streaming
// This runs on Vercel's infrastructure which is NOT blocked by CDN

import axios from 'axios';

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url, referer } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const decodedUrl = decodeURIComponent(url);
        const rangeHeader = req.headers['range'];

        // Build request headers
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': referer ? decodeURIComponent(referer) : 'https://megacloud.tv',
            'Origin': referer ? decodeURIComponent(referer) : 'https://megacloud.tv',
            'Accept': '*/*',
        };

        // Forward range header if present
        if (rangeHeader) {
            headers['Range'] = rangeHeader;
        }

        // Fetch from CDN
        const response = await axios({
            method: 'GET',
            url: decodedUrl,
            headers: headers,
            responseType: 'arraybuffer',
            validateStatus: (status) => status < 500,
            maxRedirects: 5,
            timeout: 30000,
        });

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Accept, Accept-Encoding');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges, Cache-Control');

        // Forward content type
        const contentType = response.headers['content-type'] || 'application/vnd.apple.mpegurl';
        res.setHeader('Content-Type', contentType);

        // Forward content length
        if (response.headers['content-length']) {
            res.setHeader('Content-Length', response.headers['content-length']);
        }

        // Forward content range
        if (response.headers['content-range']) {
            res.setHeader('Content-Range', response.headers['content-range']);
        }

        // Set accept ranges
        res.setHeader('Accept-Ranges', response.headers['accept-ranges'] || 'bytes');

        // Cache control
        if (decodedUrl.endsWith('.ts') || decodedUrl.endsWith('.m4s')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (decodedUrl.endsWith('.m3u8')) {
            res.setHeader('Cache-Control', 'no-cache');
        }

        // Handle M3U8 playlist - rewrite URLs to go through proxy
        if (contentType.includes('mpegurl') || decodedUrl.endsWith('.m3u8')) {
            const content = Buffer.from(response.data).toString('utf-8');
            const basePath = decodedUrl.substring(0, decodedUrl.lastIndexOf('/') + 1);

            const lines = content.split('\n');
            const newLines = lines.map(line => {
                line = line.trim();
                if (!line || line.startsWith('#')) return line;

                let targetUrl = line;
                if (!line.startsWith('http')) {
                    targetUrl = basePath + line;
                }

                // Encode and proxy
                const encodedUrl = encodeURIComponent(targetUrl);
                const encodedReferer = encodeURIComponent(referer || 'https://megacloud.tv');
                return `https://vercel-proxy-two-nu.vercel.app/api/proxy?url=${encodedUrl}&referer=${encodedReferer}`;
            });

            const newContent = newLines.join('\n');
            res.status(response.status).send(newContent);
        } else {
            // Return binary data with proper status
            res.status(response.status).send(Buffer.from(response.data));
        }

    } catch (error) {
        console.error('Proxy error:', error.message);
        if (error.response) {
            return res.status(error.response.status).json({ 
                error: 'Upstream error',
                status: error.response.status 
            });
        }
        return res.status(500).json({ error: error.message });
    }
}
