# Cloudflare Workers Deployment Guide

This guide provides instructions for deploying hianime-api to Cloudflare Workers.

## Prerequisites

- Cloudflare account (free tier available)
- Node.js 18+ or Bun installed
- Wrangler CLI installed globally: `npm install -g wrangler`

## Quick Deploy

### 1. Authenticate with Cloudflare

```bash
wrangler login
```

Or use API token:
```bash
export CLOUDFLARE_API_TOKEN=your-api-token
```

### 2. Configure Environment Variables

Set your secrets using Wrangler:

```bash
# Redis Configuration (Upstash recommended)
wrangler secret put UPSTASH_REDIS_REST_URL
wrangler secret put UPSTASH_REDIS_REST_TOKEN

# Optional: Custom base URLs
wrangler secret put HIANIME_BASE_URL
wrangler secret put BASE_URL
```

### 3. Deploy to Cloudflare Workers

```bash
# Deploy to production
wrangler deploy

# Deploy to development
wrangler dev
```

Your API will be available at: `https://hianime-api.your-subdomain.workers.dev`

## Configuration

### wrangler.toml

The `wrangler.toml` file contains your worker configuration:

```toml
name = "hianime-api"
main = "src/worker.js"
compatibility_date = "2024-01-01"
account_id = "cd4ab75cca150f63177325a6bb1c355f"

[vars]
ENVIRONMENT = "production"
```

### Environment Variables

#### Required
- `UPSTASH_REDIS_REST_URL` - Your Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` - Your Upstash Redis REST token

#### Optional
- `HIANIME_BASE_URL` - Base URL for HiAnime (default: https://hianime.to)
- `BASE_URL` - Your API base URL (default: https://hianime-api.workers.dev)
- `ORIGIN` - CORS origin (default: *)
- `NODE_ENV` - Environment (production/development)
- `RATE_LIMIT_ENABLED` - Enable rate limiting (default: true)
- `ENABLE_LOGGING` - Enable logging (default: false)

## Redis Setup (Upstash)

1. Create a free account at [Upstash](https://upstash.com)
2. Create a new Redis database
3. Copy the REST URL and token
4. Add them as secrets:
   ```bash
   wrangler secret put UPSTASH_REDIS_REST_URL
   wrangler secret put UPSTASH_REDIS_REST_TOKEN
   ```

## Custom Domain

To use a custom domain:

1. Add your domain to Cloudflare
2. Go to Workers & Pages → Your Worker → Settings → Triggers
3. Click "Add Custom Domain"
4. Enter your domain (e.g., api.yourdomain.com)

## Testing

Test your deployment:

```bash
# Health check
curl https://hianime-api.your-subdomain.workers.dev/ping

# Get homepage
curl https://hianime-api.your-subdomain.workers.dev/api/v1/home

# Get stream
curl https://hianime-api.your-subdomain.workers.dev/api/v1/stream?id=one-piece-100?ep=1
```

## Local Development

Run locally with Wrangler:

```bash
# Start development server
wrangler dev

# With port specification
wrangler dev --port 8787
```

Your local API will be available at: `http://localhost:8787`

## Monitoring

View logs in real-time:

```bash
wrangler tail
```

Or view in Cloudflare Dashboard:
- Go to Workers & Pages → Your Worker → Logs

## Limits

### Free Tier
- 100,000 requests/day
- 10ms CPU time per request
- No KV storage included

### Paid Tier ($5/month)
- 10 million requests/month
- 50ms CPU time per request
- KV storage available

## Troubleshooting

### Worker Exceeds CPU Time Limit

If you hit CPU time limits:
1. Enable Redis caching
2. Optimize heavy operations
3. Consider upgrading to paid tier

### CORS Issues

Ensure CORS headers are properly set in `src/app.js`. The default configuration allows all origins (`*`).

### Redis Connection Issues

1. Verify your Redis URL and token are correct
2. Test connection:
   ```bash
   curl https://your-redis-url.upstash.io/get/test \
     -H "Authorization: Bearer your-token"
   ```

### Module Resolution Errors

Cloudflare Workers use ES modules. Ensure:
- All imports use `.js` extension
- No Node.js-specific modules (use web-compatible alternatives)

## Performance Tips

1. **Enable Redis caching** - Reduces API calls significantly
2. **Use edge caching** - Add appropriate `Cache-Control` headers
3. **Optimize bundle size** - Remove unnecessary dependencies
4. **Use streaming** - For large responses

## API Endpoints

All endpoints are available under `/api/v1/`:

- `GET /api/v1/home` - Homepage content
- `GET /api/v1/anime/:id` - Anime details
- `GET /api/v1/stream` - Stream URLs
- `GET /api/v1/search` - Search anime
- `GET /api/v1/proxy` - Media proxy for HLS streaming

Full documentation: `https://your-worker.workers.dev/`

## Security

### API Token
Your Cloudflare API token is stored securely. Never commit it to git.

### Rate Limiting
Rate limiting is enabled by default using client IP detection via `cf-connecting-ip` header.

### CORS
Configure allowed origins in `src/config/config.js` or via `ORIGIN` environment variable.

## Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Issues](https://github.com/ryanwtf88/hianime-api/issues)

## Migration from Vercel

If migrating from Vercel:
1. All Vercel-specific code has been removed
2. Environment variables remain the same
3. Redis (Upstash) setup is identical
4. API endpoints are unchanged

## Additional Resources

- [Cloudflare Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Upstash Redis](https://upstash.com/)
- [HiAnime API GitHub](https://github.com/ryanwtf88/hianime-api)
