# HiAnime API - Vercel Proxy

This is a standalone HLS proxy deployed on Vercel to add CORS headers.

## Why Separate Deployment?

1. **Main API** (Cloudflare Workers) - Gets blocked by CDN (403)
2. **Proxy** (Vercel) - Can access CDN successfully
3. **CDN** - Doesn't send CORS headers, needs proxy to add them

## Deployment

### Option 1: Vercel CLI

```bash
cd vercel-proxy
npm install
vercel --prod
```

### Option 2: Vercel Dashboard

1. Go to https://vercel.com/new
2. Import this `vercel-proxy` folder
3. Project name: `animo-proxy`
4. Deploy

### Option 3: GitHub Integration

1. Push to GitHub
2. Connect to Vercel
3. Auto-deploys on push

## Configuration

The proxy will be available at:
- `https://animo-proxy.vercel.app/api/proxy`

## Usage

```
GET https://animo-proxy.vercel.app/api/proxy?url=ENCODED_URL&referer=ENCODED_REFERER
```

**Parameters:**
- `url` - The CDN URL to proxy (URL encoded)
- `referer` - The referer header (URL encoded, optional)

**Features:**
- Adds CORS headers
- Forwards Range requests
- Rewrites M3U8 playlists
- Caches segments appropriately

## Testing

```bash
# Test health
curl https://animo-proxy.vercel.app/api/proxy?url=https%3A%2F%2Fexample.com

# Test with actual stream
curl "https://animo-proxy.vercel.app/api/proxy?url=ENCODED_M3U8_URL&referer=https%3A%2F%2Fmegacloud.tv"
```

## Environment Variables

None required - works out of the box!

## Notes

- Proxy rewrites M3U8 segment URLs to also use this proxy
- Handles both playlists and segments
- Supports Range requests for seeking
- Max request timeout: 30 seconds
