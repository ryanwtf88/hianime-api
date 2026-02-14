# hianime-api

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.4-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Bun](https://img.shields.io/badge/bun-%23000000.svg?style=flat&logo=bun&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)

**A RESTful API that utilizes web scraping to fetch anime content from hianime.to**

[Documentation](./docs/README.md) • [Installation](#installation) • [Deployment](#deployment)

</div>

---

- [Overview](#overview)
- [Important Notice](#important-notice)
- [Installation](#installation)
- [Deployment](#deployment)
- [Development](#development)

---

## Overview

hianime-api is a comprehensive RESTful API that provides endpoints to retrieve anime details, episodes, and streaming links by scraping content from hianime.to. Built with modern web technologies, it offers a robust solution for anime content aggregation.

## Important Notice

> ![Disclaimer](https://img.shields.io/badge/Disclaimer-red?style=for-the-badge&logo=alert&logoColor=white)

1. This API is recommended for **personal use only**. Deploy your own instance and customize it as needed.
2. This API is just an **unofficial API for [hianime.to](https://hianime.to)** and is in no other way officially related to the same.
3. The content that this API provides is not mine, nor is it hosted by me. These belong to their respective owners. This API just demonstrates how to build an API that scrapes websites and uses their content.

## Used By

This API is used by the following projects:

- **[ANIMO](https://4animo.xyz)**: A comprehensive anime streaming platform that leverages this API for real-time anime data, schedules, and streaming links. Check it out to see the API in action!

---

## Installation

### Prerequisites

Make sure you have Bun.js installed on your system.

**Install Bun.js:**

```bash
https://bun.sh/docs/installation
```

### NPM Usage

**Run via CLI (npx):**

```bash
npx @ryanwtf88/hianime-api
```

**Install as Library:**

```bash
npm install @ryanwtf88/hianime-api
```

**Usage as Library:**

```javascript
import app from '@ryanwtf88/hianime-api';
// Mount app or use fetch handler
```

### Local Setup

**Step 1:** Clone the repository

```bash
git clone https://github.com/ryanwtf88/hianime-api.git
```

**Step 2:** Navigate to the project directory

```bash
cd hianime-api
```

**Step 3:** Install dependencies

```bash
bun install
```

**Step 4:** Start the development server

```bash
bun run dev
```

The server will be running at [http://localhost:3030](http://localhost:3030)

---

## Deployment

### Docker Deployment

**Prerequisites:**
- Docker installed ([Install Docker](https://docs.docker.com/get-docker/))

#### Using Pre-built Image from GitHub Container Registry

**Pull and run the latest image:**

```bash
docker pull ghcr.io/ryanwtf88/hianime-api:latest
docker run -p 3030:3030 ghcr.io/ryanwtf88/hianime-api:latest
```

**Run with environment variables:**

```bash
docker run -p 3030:3030 \
  -e NODE_ENV=production \
  -e PORT=3030 \
  ghcr.io/ryanwtf88/hianime-api:latest
```

**Available tags:**
- `latest` - Latest stable build from master branch
- `v1.0.4` - Specific version
- `master` - Latest commit from master branch

**Multi-platform support:**
- `linux/amd64` - x86_64 architecture
- `linux/arm64` - ARM64 architecture (Apple Silicon, AWS Graviton)

#### Build from Source

**Build the Docker image:**

```bash
docker build -t hianime-api .
```

**Run the container:**

```bash
docker run -p 3030:3030 hianime-api
```

#### Using Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  hianime-api:
    image: ghcr.io/ryanwtf88/hianime-api:latest
    # Or build from source:
    # build: .
    ports:
      - "3030:3030"
    environment:
      - NODE_ENV=production
      - PORT=3030
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3030/api/v1/home"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Then run:

```bash
docker-compose up -d
```

### Vercel Deployment (Serverless) ![Recommended](https://img.shields.io/badge/Recommended-blue?style=flat-square)

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ryanwtf88/hianime-api)

**Manual Deployment:**

1. Fork or clone the repository to your GitHub account
2. Sign up at [Vercel](https://vercel.com)
3. Create a new project and import your repository
4. Configure environment variables in Vercel Dashboard:
   - `UPSTASH_REDIS_REST_URL` (Required - Get from [Upstash](https://upstash.com))
   - `UPSTASH_REDIS_REST_TOKEN` (Required)
   - `ORIGIN=*` (or your frontend domain)
   - `RATE_LIMIT_ENABLED=true`
   - `RATE_LIMIT_WINDOW_MS=60000`
   - `RATE_LIMIT_LIMIT=100`
5. Click "Deploy"

**Why Vercel?**
- ![Supported](https://img.shields.io/badge/Supported-brightgreen?style=flat-square) Serverless architecture with automatic scaling
- ![Supported](https://img.shields.io/badge/Supported-brightgreen?style=flat-square) Global CDN for fast response times
- ![Supported](https://img.shields.io/badge/Supported-brightgreen?style=flat-square) Free tier with generous limits
- ![Supported](https://img.shields.io/badge/Supported-brightgreen?style=flat-square) Automatic HTTPS and custom domains
- ![Supported](https://img.shields.io/badge/Supported-brightgreen?style=flat-square) Git-based deployments (auto-deploy on push)
- ![Supported](https://img.shields.io/badge/Supported-brightgreen?style=flat-square) Built-in Redis support via Upstash

**Environment Variables:**

| Key | Value | Required |
|-----|-------|----------|
| `UPSTASH_REDIS_REST_URL` | Your Upstash Redis URL | Yes |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash Redis Token | Yes |
| `ORIGIN` | `*` or your domain | No |
| `RATE_LIMIT_ENABLED` | `true` | No |
| `RATE_LIMIT_WINDOW_MS` | `60000` | No |
| `RATE_LIMIT_LIMIT` | `100` | No |

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Replit Deployment

1. Import this repository into Replit
2. Click the Run button
3. Your API will be available at your Replit URL

For detailed deployment instructions, troubleshooting, and best practices, see the [DEPLOYMENT.md](https://github.com/ryanwtf88/hianime-api/blob/master/DEPLOYMENT.md) guide.

---

### Cloudflare Workers Deployment

![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)

Deploy this API to Cloudflare Workers for edge computing with global distribution.

**Prerequisites:**
- Cloudflare account ([Sign up](https://dash.cloudflare.com/sign-up))
- Wrangler CLI installed globally

**Step 1:** Install Wrangler CLI

```bash
npm install -g wrangler
```

**Step 2:** Login to Cloudflare

```bash
wrangler login
```

**Step 3:** Update `wrangler.toml` with your account ID

```toml
name = "hianime-api"
main = "worker.js"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

account_id = "YOUR_ACCOUNT_ID"  # Replace with your Cloudflare account ID

[observability]
enabled = true
```

**Step 4:** Deploy to Cloudflare Workers

```bash
npm run deploy:cloudflare
# or
bun run deploy:cloudflare
```

**Step 5:** Test your deployment

Your API will be available at: `https://hianime-api.YOUR_SUBDOMAIN.workers.dev`

**Development Mode:**

```bash
npm run dev:cloudflare
# or
bun run dev:cloudflare
```

**Why Cloudflare Workers?**
- Edge computing with global distribution
- Extremely fast response times (< 50ms)
- Free tier with 100,000 requests/day
- Automatic scaling and DDoS protection
- No cold starts
- Built-in rate limiting disabled for better performance

**Custom Domain:**

To use a custom domain with Cloudflare Workers:

1. Go to your Cloudflare Workers dashboard
2. Select your worker
3. Click "Triggers" tab
4. Add a custom domain or route

**Environment Variables:**

Cloudflare Workers doesn't use traditional environment variables. All configuration is in `src/config/config.js`.

---

### Proxy Service Deployment

![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)

This API requires an external proxy service to handle M3U8 stream rewriting and bypass CDN restrictions. The proxy must be deployed separately on Cloudflare Workers.

**Proxy Repository:** [https://github.com/ryanwtf88/hianime-proxy](https://github.com/ryanwtf88/hianime-proxy)

**Deploy Your Own Proxy:**

1. Clone the proxy repository:

```bash
git clone https://github.com/ryanwtf88/hianime-proxy.git
cd hianime-proxy
```

2. Install dependencies:

```bash
npm install
```

3. Update `wrangler.toml` with your Cloudflare account ID:

```toml
name = "hianime-proxy"
main = "worker.js"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

account_id = "YOUR_ACCOUNT_ID"
```

4. Deploy to Cloudflare Workers:

```bash
wrangler deploy
```

5. Update the proxy URL in this API's `src/config/config.js`:

```javascript
proxyUrl: 'https://your-proxy.workers.dev',
```

**Proxy Features:**
- M3U8 playlist rewriting for seamless streaming
- CDN bypass using socket connections for blocked hostnames
- CORS header management
- Referer header preservation
- Supports both video streams and subtitle files

**Why Separate Proxy?**
- Better performance with edge computing
- Independent scaling
- Easier to update proxy logic without redeploying main API
- Can be shared across multiple API instances

---

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev
```


## Contributors

Thanks to the following people for keeping this project alive and relevant:

<a href="https://github.com/ryanwtf88/hianime-api/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ryanwtf88/hianime-api" alt="Contributors" />
</a>

Want to contribute? Check out our [contribution guidelines](https://github.com/ryanwtf88/hianime-api/blob/master/CONTRIBUTING.md) and feel free to submit a pull request!

---

## Acknowledgments

Special thanks to the following projects for inspiration and reference:
- [hianime-api](https://github.com/ryanwtf88/hianime-api)
- [consumet.ts](https://github.com/consumet/consumet.ts)
- [api.consumet.org](https://github.com/consumet/api.consumet.org)

---

## Support

If you find this project useful, please consider giving it a star on GitHub!

[![GitHub stars](https://img.shields.io/github/stars/ryanwtf88/hianime-api?style=social)](https://github.com/ryanwtf88/hianime-api/stargazers)

---

<div align="center">

**Made by RY4N**

[Report Bug](https://github.com/ryanwtf88/hianime-api/issues) • [Request Feature](https://github.com/ryanwtf88/hianime-api/issues)

</div>
