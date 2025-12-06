import { Hono } from 'hono';
import axios from 'axios';

const proxyController = async (c) => {
    const url = c.req.query('url');
    const referer = c.req.query('referer');

    if (!url) {
        return c.text('URL is required', 400);
    }

    // Decode the URL if it's encoded
    const decodedUrl = decodeURIComponent(url);
    
    // Validate URL format
    if (!decodedUrl.startsWith('http://') && !decodedUrl.startsWith('https://')) {
        console.error(`Invalid URL format: ${decodedUrl}`);
        return c.text('Invalid URL format', 400);
    }

    try {
        // Get range header from incoming request
        const rangeHeader = c.req.header('range');
        
        // Build request headers
        const requestHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': referer || 'https://megacloud.tv',
            'Origin': referer || 'https://megacloud.tv',
            'Accept': '*/*',
        };

        // Forward range header if present
        if (rangeHeader) {
            requestHeaders['Range'] = rangeHeader;
        }

        // Use axios for better binary handling
        const response = await axios({
            method: 'GET',
            url: decodedUrl,
            headers: requestHeaders,
            responseType: 'arraybuffer',
            validateStatus: (status) => status < 400, // Accept 2xx and 3xx
            maxRedirects: 5,
            timeout: 30000,
            decompress: false, // Don't decompress - handle raw data
        });

        const contentType = response.headers['content-type'] || 'application/vnd.apple.mpegurl';
        const contentLength = response.headers['content-length'];
        const contentRange = response.headers['content-range'];
        const acceptRanges = response.headers['accept-ranges'];

        // Add CORS headers
        c.header('Access-Control-Allow-Origin', '*');
        c.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        c.header('Access-Control-Allow-Headers', 'Range, Content-Type, Accept, Accept-Encoding');
        c.header('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges, Cache-Control');
        c.header('Content-Type', contentType);

        // Forward Content-Length header
        if (contentLength) {
            c.header('Content-Length', contentLength);
        }

        // Forward Content-Range header if present (for partial content)
        if (contentRange) {
            c.header('Content-Range', contentRange);
        }

        // Forward Accept-Ranges header
        if (acceptRanges) {
            c.header('Accept-Ranges', acceptRanges);
        } else {
            // Default to accepting byte ranges for video segments
            c.header('Accept-Ranges', 'bytes');
        }

        // Cache control for media segments
        if (decodedUrl.endsWith('.ts') || decodedUrl.endsWith('.m4s')) {
            c.header('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (decodedUrl.endsWith('.m3u8')) {
            c.header('Cache-Control', 'no-cache');
        }

        // If it's an M3U8 playlist, we need to rewrite the internal URLs
        if (contentType.includes('mpegurl') || decodedUrl.endsWith('.m3u8')) {
            // Convert buffer to text for M3U8
            const content = Buffer.from(response.data).toString('utf-8');

            // Resolve base URL for relative paths
            const basePath = decodedUrl.substring(0, decodedUrl.lastIndexOf('/') + 1);

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

        // For TS segments or other binary data
        // Verify we actually have data
        if (!response.data || response.data.byteLength === 0) {
            console.error(`Empty response for ${decodedUrl}`);
            return c.text('Empty response from upstream', 502);
        }
        
        // Additional validation for TS segments
        if (decodedUrl.endsWith('.ts')) {
            // Check if it looks like valid MPEG-TS data (should start with 0x47 sync byte)
            const firstByte = response.data[0];
            if (firstByte !== 0x47) {
                console.warn(`Warning: TS segment may be corrupted. First byte: 0x${firstByte.toString(16)}`);
            }
        }

        // Log segment size for debugging
        const filename = decodedUrl.split('/').pop().split('?')[0];
        console.log(`Proxying segment: ${filename} - Size: ${response.data.byteLength} bytes`);
        
        // Return 206 status for partial content (range requests)
        if (response.status === 206 || contentRange) {
            c.status(206);
        }
        
        // Return the binary data directly
        return c.body(response.data);

    } catch (error) {
        const safeUrl = url ? url.substring(0, 100) + '...' : 'undefined';
        console.error(`Proxy Error for ${safeUrl}:`, error.message);
        if (error.response) {
            console.error(`Upstream status: ${error.response.status}, URL: ${safeUrl}`);
            return c.text(`Upstream error: ${error.response.status}`, error.response.status);
        }
        return c.text(`Proxy Error: ${error.message}`, 500);
    }
};

export default proxyController;
