# Deployment Guide

This guide provides comprehensive instructions for deploying hianime-api using Docker, Vercel (recommended), and other platforms.

## Table of Contents

- [Quick Start](#quick-start)
- [Vercel Deployment](#vercel-deployment-recommended)
  - [Prerequisites](#prerequisites)
  - [One-Click Deploy](#one-click-deploy)
  - [Manual Deployment](#manual-deployment)
  - [Environment Variables](#environment-variables)
  - [Redis Setup with Upstash](#redis-setup-with-upstash)
- [Docker Deployment](#docker-deployment)
  - [Building the Image](#building-the-docker-image)
  - [Running the Container](#running-the-container)
  - [Docker Compose](#docker-compose)
- [Railway Deployment](#railway-deployment)
- [Replit Deployment](#replit-deployment)
- [Environment Variables Reference](#environment-variables-reference)
- [Redis Caching Setup](#redis-caching-setup)
- [Troubleshooting](#troubleshooting)
- [Performance Optimization](#performance-optimization)
- [Production Best Practices](#production-best-practices)

---

## Quick Start

**Fastest deployment options:**

1. **Vercel** (Recommended) - Click deploy button below
2. **Docker** - `docker build -t hianime-api . && docker run -p 3030:3030 hianime-api`
3. **Railway** - Connect GitHub repo and deploy

---

## Vercel Deployment (Recommended)

Vercel provides the best serverless deployment experience with automatic scaling, global CDN, and built-in Redis support.

### Prerequisites

- GitHub account
- Vercel account (free tier available)
- Upstash account for Redis (free tier available)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ryanwtf88/hianime-api)

### Manual Deployment

1. **Fork the repository** to your GitHub account

2. **Sign up at [Vercel](https://vercel.com)** if you haven't already

3. **Create a new project:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your forked repository
   - Select the repository: `your-username/hianime-api`

4. **Configure project settings:**
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: Leave empty (serverless)
   - **Output Directory**: Leave empty
   - **Install Command**: `bun install`

5. **Add environment variables** (see [Environment Variables](#environment-variables) section)

6. **Deploy**: Click "Deploy"

7. **Wait for deployment**: First deployment takes 2-3 minutes

### Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable                   | Value                    | Required | Description             |
| -------------------------- | ------------------------ | -------- | ----------------------- |
| `UPSTASH_REDIS_REST_URL`   | Your Upstash Redis URL   | **Yes**  | Redis connection URL    |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash Redis Token | **Yes**  | Redis auth token        |
| `ORIGIN`                   | `*` or your domain       | No       | CORS allowed origins    |
| `RATE_LIMIT_ENABLED`       | `true`                   | No       | Enable rate limiting    |
| `RATE_LIMIT_WINDOW_MS`     | `60000`                  | No       | Rate limit window (ms)  |
| `RATE_LIMIT_LIMIT`         | `100`                    | No       | Max requests per window |
| `LOG_LEVEL`                | `INFO`                   | No       | Logging level           |
| `ENABLE_LOGGING`           | `true`                   | No       | Enable request logging  |

### Redis Setup with Upstash

Redis caching is **required** for Vercel deployment to improve performance and reduce API calls.

**Step 1: Create Upstash Account**

1. Go to [Upstash Console](https://console.upstash.com/)
2. Sign up with GitHub (free)

**Step 2: Create Redis Database**

1. Click "Create Database"
2. **Name**: `hianime-api-cache`
3. **Type**: Regional (faster) or Global (more reliable)
4. **Region**: Choose closest to your users
5. **Eviction**: Enable eviction (recommended)
6. Click "Create"

**Step 3: Get Credentials**

1. Go to database details
2. Scroll to "REST API" section
3. Copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

**Step 4: Add to Vercel**

1. Go to Vercel Project Settings
2. Navigate to "Environment Variables"
3. Add both variables
4. Redeploy your project

**Verify Redis is Working:**

```bash
# Test cache endpoint
curl https://your-api.vercel.app/api/v1/home

# Check logs in Vercel dashboard for:
# "Redis client initialized successfully"
# "Cache HIT: home" or "Cache MISS: home"
```

### Vercel-Specific Configuration

The `vercel.json` file configures serverless deployment:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

### Custom Domain

1. Go to Project Settings → Domains
2. Click "Add"
3. Enter your domain
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

### Monitoring

**View logs:**

- Go to Deployments tab
- Click on deployment
- View "Functions" logs

**Monitor performance:**

- Analytics tab shows request metrics
- Speed Insights for performance data

---

## Docker Deployment

### Building the Docker Image

```bash
# Clone repository
git clone https://github.com/ryanwtf88/hianime-api.git
cd hianime-api

# Build image
docker build -t hianime-api .

# Verify
docker images | grep hianime-api
```

### Running the Container

**Basic run:**

```bash
docker run -p 3030:3030 hianime-api
```

**With environment variables:**

```bash
docker run -p 3030:3030 \
  -e NODE_ENV=production \
  -e PORT=3030 \
  -e UPSTASH_REDIS_REST_URL=your_redis_url \
  -e UPSTASH_REDIS_REST_TOKEN=your_redis_token \
  hianime-api
```

**Detached mode (background):**

```bash
docker run -d \
  -p 3030:3030 \
  --name hianime-api \
  --restart unless-stopped \
  hianime-api
```

**View logs:**

```bash
docker logs -f hianime-api
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  hianime-api:
    build: .
    container_name: hianime-api
    ports:
      - '3030:3030'
    environment:
      - NODE_ENV=production
      - PORT=3030
      - UPSTASH_REDIS_REST_URL=${UPSTASH_REDIS_REST_URL}
      - UPSTASH_REDIS_REST_TOKEN=${UPSTASH_REDIS_REST_TOKEN}
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3030/ping']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: 'json-file'
      options:
        max-size: '10m'
        max-file: '3'
```

**Commands:**

```bash
# Start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild and start
docker-compose up -d --build
```

---

## Railway Deployment

Railway offers excellent Docker support with generous free tier.

### Steps:

1. **Create account** at [Railway](https://railway.app/)

2. **New project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect GitHub and select repository

3. **Configure:**
   - Railway auto-detects Dockerfile
   - Add environment variables in Variables tab
   - Deploy automatically starts

4. **Get URL:**
   - Railway provides URL like `https://hianime-api.up.railway.app`

5. **Custom domain** (optional):
   - Settings → Generate Domain or add custom

**Benefits:**

- $5 free credit/month
- Excellent Docker support
- Auto-deploy on git push
- Built-in monitoring

---

## Replit Deployment

Good for testing and development.

### Steps:

1. **Import repository:**
   - Go to [Replit](https://replit.com/)
   - Create → Import from GitHub
   - Enter: `https://github.com/ryanwtf88/hianime-api`

2. **Configure:**
   - Create `.replit` file:

   ```toml
   run = "bun run start"

   [nix]
   channel = "stable-22_11"
   ```

3. **Add secrets:**
   - Click Secrets (🔒 icon)
   - Add environment variables

4. **Run:**
   - Click Run button
   - Access via Replit URL

**Limitations:**

- Free tier sleeps after inactivity
- Limited resources
- Better for development than production

---

## Environment Variables Reference

### Required Variables

| Variable                   | Example                      | Description         |
| -------------------------- | ---------------------------- | ------------------- |
| `UPSTASH_REDIS_REST_URL`   | `https://your-db.upstash.io` | Upstash Redis URL   |
| `UPSTASH_REDIS_REST_TOKEN` | `AXaEAAInc...`               | Upstash Redis token |

### Optional Variables

| Variable               | Default              | Description                          |
| ---------------------- | -------------------- | ------------------------------------ |
| `PORT`                 | `5000`               | Server port                          |
| `NODE_ENV`             | `development`        | Environment mode                     |
| `ORIGIN`               | `*`                  | CORS allowed origins                 |
| `RATE_LIMIT_ENABLED`   | `true`               | Enable rate limiting                 |
| `RATE_LIMIT_WINDOW_MS` | `60000`              | Rate limit window (1 min)            |
| `RATE_LIMIT_LIMIT`     | `1000000000`         | Max requests per window              |
| `LOG_LEVEL`            | `INFO`               | Log level (ERROR, WARN, INFO, DEBUG) |
| `ENABLE_LOGGING`       | `false`              | Enable request logging               |
| `HIANIME_BASE_URL`     | `https://hianime.to` | Source website URL                   |
| `BASE_URL`             | Auto-detected        | API base URL                         |

### Setting Environment Variables

**Vercel:**

```bash
# Via CLI
vercel env add UPSTASH_REDIS_REST_URL

# Or in dashboard: Settings → Environment Variables
```

**Docker:**

```bash
# Via command line
docker run -e VAR_NAME=value ...

# Via .env file
docker run --env-file .env ...
```

**Railway:**

- Dashboard → Variables tab → Add variable

---

## Redis Caching Setup

### Why Redis?

- **Performance**: 90%+ faster response times
- **Reduced Load**: Fewer requests to source website
- **Scalability**: Handle more concurrent users
- **Cost**: Free tier sufficient for most use cases

### Cache Strategy

**Cached Endpoints:**

- `/api/v1/home` - 24 hours
- `/api/v1/anime/:id` - 24 hours

**Cache Keys:**

- `home` - Homepage data
- `anime:{id}` - Anime details

**TTL (Time To Live):**

- Default: 24 hours (86400 seconds)
- Configurable in code

### Clear Cache

```bash
# Clear all cache
curl https://your-api.vercel.app/api/v1/admin/clear-cache
```

### Monitor Cache Performance

Check logs for:

- `Cache HIT: key` - Data served from cache (fast)
- `Cache MISS: key` - Data fetched from source (slow)
- `Cache SET: key (TTL: 86400s)` - Data cached

---

## Troubleshooting

### Vercel Issues

**Build fails:**

- Check build logs in deployment details
- Verify `package.json` has all dependencies
- Ensure `bun.lockb` is committed
- Check `vercel.json` syntax

**Function timeout:**

- Vercel has 10s timeout on Hobby plan
- Implement caching to reduce response time
- Upgrade to Pro for 60s timeout

**Redis connection fails:**

- Verify environment variables are set
- Check Upstash database is active
- Test Redis URL with curl
- Ensure region is correct

**CORS errors:**

- Set `ORIGIN` environment variable
- Check allowed origins in `config.js`
- Verify request headers

### Docker Issues

**Port already in use:**

```bash
# Find process
lsof -i :3030  # macOS/Linux
netstat -ano | findstr :3030  # Windows

# Use different port
docker run -p 3031:3030 hianime-api
```

**Container exits immediately:**

```bash
# Check logs
docker logs hianime-api

# Run interactively
docker run -it hianime-api /bin/sh
```

**Build fails:**

```bash
# Clear cache and rebuild
docker build --no-cache -t hianime-api .

# Check Dockerfile syntax
docker build --progress=plain -t hianime-api .
```

### General Issues

**API not responding:**

1. Check service is running
2. Verify correct port
3. Test health endpoint: `/ping`
4. Check firewall settings
5. Review application logs

**Slow responses:**

1. Verify Redis is configured
2. Check cache hit rate in logs
3. Monitor source website speed
4. Consider upgrading instance

**Rate limiting errors:**

1. Implement request caching
2. Add delays between requests
3. Respect source website limits
4. Use multiple instances

---

## Performance Optimization

### 1. Enable Redis Caching

**Impact**: 90%+ faster responses

```javascript
// Already implemented in:
// - src/controllers/homepage.controller.js
// - src/controllers/detailpage.controller.js
```

### 2. Optimize Cache TTL

```javascript
// Adjust based on data freshness needs
await withCache('key', fetchFunction, 60 * 60 * 24); // 24 hours
```

### 3. Use CDN

- Vercel includes global CDN automatically
- Reduces latency for global users

### 4. Monitor Performance

**Vercel Analytics:**

- Enable in Project Settings
- View response times
- Identify slow endpoints

**Upstash Metrics:**

- Monitor cache hit rate
- Track memory usage
- Optimize eviction policy

### 5. Implement Rate Limiting

```javascript
// Already configured in config.js
rateLimit: {
  windowMs: 60000,  // 1 minute
  limit: 100,       // 100 requests
  enabled: true
}
```

---

## Production Best Practices

### Security

✅ **Use HTTPS only** (automatic on Vercel)  
✅ **Set CORS properly** - Don't use `*` in production  
✅ **Enable rate limiting**  
✅ **Keep dependencies updated**: `bun update`  
✅ **Rotate Redis credentials** regularly  
✅ **Use environment variables** for secrets

### Monitoring

✅ **Set up uptime monitoring** (UptimeRobot, Pingdom)  
✅ **Enable error tracking** (Sentry, LogRocket)  
✅ **Monitor cache performance**  
✅ **Track API response times**  
✅ **Set up alerts** for downtime

### Scaling

✅ **Start with free tier**  
✅ **Monitor resource usage**  
✅ **Scale when needed** (Vercel auto-scales)  
✅ **Use caching** to reduce load  
✅ **Implement request queuing** for high traffic

### Maintenance

✅ **Keep documentation updated**  
✅ **Test updates in staging**  
✅ **Use semantic versioning**  
✅ **Backup configurations**  
✅ **Document deployment process**

---

## Additional Resources

### Official Documentation

- [Vercel Documentation](https://vercel.com/docs)
- [Upstash Documentation](https://docs.upstash.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Railway Documentation](https://docs.railway.app/)
- [Bun Documentation](https://bun.sh/docs)

### Project Resources

- [GitHub Repository](https://github.com/ryanwtf88/hianime-api)
- [API Documentation](https://github.com/ryanwtf88/hianime-api#documentation)
- [Issues Tracker](https://github.com/ryanwtf88/hianime-api/issues)
- [Discussions](https://github.com/ryanwtf88/hianime-api/discussions)

### Support

- [Report Bug](https://github.com/ryanwtf88/hianime-api/issues/new)
- [Request Feature](https://github.com/ryanwtf88/hianime-api/issues/new)
- [Ask Question](https://github.com/ryanwtf88/hianime-api/discussions)

---

**Made with ❤️ by RY4N**

For more deployment options and advanced configurations, see the [README.md](./README.md).
