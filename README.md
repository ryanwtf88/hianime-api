# hianime-api

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.4-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Bun](https://img.shields.io/badge/bun-%23000000.svg?style=flat&logo=bun&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)

**A RESTful API that utilizes web scraping to fetch anime content from hianime.to**

[Documentation](#documentation) • [Installation](#installation) • [API Endpoints](#api-endpoints) • [Development](#development)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Important Notice](#important-notice)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
- [Deployment](#deployment)
  - [Docker Deployment](#docker-deployment)
  - [Cloudflare Workers Deployment](#cloudflare-workers-deployment)
  - [Vercel Deployment](#vercel-deployment-serverless--recommended)
  - [Replit Deployment](#replit-deployment)
  - [Proxy Service Deployment](#proxy-service-deployment)
- [Documentation](#documentation)
  - [Anime Home Page](#1-get-anime-home-page)
  - [Anime Schedule](#2-get-anime-schedule)
  - [Next Episode Schedule](#3-get-next-episode-schedule)
  - [Anime List Page](#4-get-anime-list-page)
  - [Anime Details](#5-get-anime-detailed-info)
  - [Search Results](#6-get-search-results)
  - [Search Suggestions](#7-get-search-suggestions)
  - [Filter Anime](#8-filter-anime)
  - [Filter Options](#9-get-filter-options)
  - [Anime Characters](#10-get-anime-characters)
  - [Character Details](#11-get-character-details)
  - [Anime Episodes](#12-get-anime-episodes)
  - [Episode Servers](#13-get-anime-episode-servers)
  - [Streaming Links](#14-get-anime-episode-streaming-links)
  - [Embedded Player](#15-get-embedded-video-player)
  - [Proxy Stream/Subtitle](#16-get-proxy-streamsubtitle)
  - [Anime Schedules](#17-get-anime-schedules-7-days)
  - [All Genres](#18-get-all-genres)
  - [Top Airing](#19-get-top-airing)
  - [Most Popular](#20-get-most-popular)
  - [Most Favorite](#21-get-most-favorite)
  - [Completed Anime](#22-get-completed-anime)
  - [Recently Added](#23-get-recently-added)
  - [Recently Updated](#24-get-recently-updated)
  - [Top Upcoming](#25-get-top-upcoming)
  - [Genre List](#26-get-anime-by-genre)
  - [Producer List](#27-get-anime-by-producer)
  - [Subbed Anime](#28-get-subbed-anime)
  - [Dubbed Anime](#29-get-dubbed-anime)
  - [Movies](#30-get-anime-movies)
  - [TV Series](#31-get-tv-series)
  - [OVA](#32-get-ova)
  - [ONA](#33-get-ona)
  - [Special](#34-get-special)
  - [Events](#35-get-events)
  - [Anime News](#37-get-anime-news)
  - [Watch2gether Rooms](#38-get-watch2gether-rooms)
  - [Watch2gether Player](#381-get-watch2gether-player-data)
  - [Random Anime](#39-get-random-anime)
  - [Clear Cache](#36-clear-redis-cache)
- [Development](#development)
- [Contributors](#contributors)
- [Acknowledgments](#acknowledgments)
- [Support](#support)

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

- **[Animo](https://animo.qzz.io/)**: A comprehensive anime streaming platform that leverages this API for real-time anime data, schedules, and streaming links. Check it out to see the API in action!

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
docker run -p 5000:5000 ghcr.io/ryanwtf88/hianime-api:latest
```

**Run with environment variables:**

```bash
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e PORT=5000 \
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
docker run -p 5000:5000 hianime-api
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
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/v1/home"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Then run:

```bash
docker-compose up -d
```

### Cloudflare Workers Deployment

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
- ![Supported](https://img.shields.io/badge/Supported-brightgreen?style=flat-square) Edge computing with global distribution
- ![Supported](https://img.shields.io/badge/Supported-brightgreen?style=flat-square) Extremely fast response times (< 50ms)
- ![Supported](https://img.shields.io/badge/Supported-brightgreen?style=flat-square) Free tier with 100,000 requests/day
- ![Supported](https://img.shields.io/badge/Supported-brightgreen?style=flat-square) Automatic scaling and DDoS protection
- ![Supported](https://img.shields.io/badge/Supported-brightgreen?style=flat-square) No cold starts
- ![Supported](https://img.shields.io/badge/Supported-brightgreen?style=flat-square) Built-in rate limiting disabled for better performance

**Custom Domain:**

To use a custom domain with Cloudflare Workers:

1. Go to your Cloudflare Workers dashboard
2. Select your worker
3. Click "Triggers" tab
4. Add a custom domain or route

**Environment Variables:**

Cloudflare Workers doesn't use traditional environment variables. All configuration is in `src/config/config.js`.

---

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

### Proxy Service Deployment

This API uses an external proxy service to handle M3U8 stream rewriting and bypass CDN restrictions. The proxy is deployed separately on Cloudflare Workers.

**Proxy Repository:** The proxy service is located in a separate repository/folder.

**Current Proxy URL:** `https://proxy.animo.qzz.io`

**Deploy Your Own Proxy:**

1. Navigate to your proxy folder (if separate repo, clone it)
2. Update `wrangler.toml` with your Cloudflare account ID:

```toml
name = "hianime-proxy"
main = "worker.js"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

account_id = "YOUR_ACCOUNT_ID"
```

3. Deploy to Cloudflare Workers:

```bash
cd proxy
wrangler deploy
```

4. Update the proxy URL in `src/config/config.js`:

```javascript
proxyUrl: 'https://your-proxy.workers.dev',
```

**Proxy Features:**
- M3U8 playlist rewriting for seamless streaming
- CDN bypass using socket connections for blocked hostnames
- CORS header management
- Referer header preservation
- Supports both video streams and subtitle files

**Supported CDN Hostnames (Socket Fetch):**
- haildrop.com
- douvid.com
- lightningspark.site
- sunburst.stream
- rainveil.net
- fogtwist.com
- stormshade.xyz
- sunshinerays.com
- netmagcdn.com

**Why Separate Proxy?**
- Better performance with edge computing
- Independent scaling
- Easier to update proxy logic without redeploying main API
- Can be shared across multiple API instances

---

## Documentation

All endpoints return JSON responses. Base URL: `/api/v1`

### 1. GET Anime Home Page

Retrieve the home page data including spotlight anime, trending shows, top airing, and more.

**Endpoint:**
```
GET /api/v1/home
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/home');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "spotlight": [...],
    "trending": [...],
    "topAiring": [...],
    "mostPopular": [...],
    "mostFavorite": [...],
    "latestCompleted": [...],
    "latestEpisode": [...],
    "newAdded": [...],
    "topUpcoming": [...],
    "top10": {
      "today": [...],
      "week": [...],
      "month": [...]
    },
    "genres": [...]
  }
}
```

---

### 2. GET Next Episode Schedule

Get the next episode schedule for a specific anime.

**Endpoint:**
```
GET /api/v1/schedule/next/:id
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/schedule/next/one-piece-100');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "nextEpisode": {
      "episodeNumber": 1120,
      "releaseDate": "2024-12-15"
    }
  }
}
```

---

### 4. GET Anime List Page

Retrieve anime lists based on various categories and filters.

**Endpoint:**
```
GET /api/v1/animes/:query/:category?page=:page
```

**Valid Queries:**

| Query | Has Category | Category Options |
|-------|--------------|------------------|
| `top-airing` | No | - |
| `most-popular` | No | - |
| `most-favorite` | No | - |
| `completed` | No | - |
| `recently-added` | No | - |
| `recently-updated` | No | - |
| `top-upcoming` | No | - |
| `genre` | Yes | action, adventure, cars, comedy, dementia, demons, drama, ecchi, fantasy, game, harem, historical, horror, isekai, josei, kids, magic, martial arts, mecha, military, music, mystery, parody, police, psychological, romance, samurai, school, sci-fi, seinen, shoujo, shoujo ai, shounen, shounen ai, slice of life, space, sports, super power, supernatural, thriller, vampire |
| `producer` | Yes | Any producer slug (e.g., bones, toei-animation, mappa) |
| `az-list` | Yes | 0-9, all, a-z |
| `subbed-anime` | No | - |
| `dubbed-anime` | No | - |
| `movie` | No | - |
| `tv` | No | - |
| `ova` | No | - |
| `ona` | No | - |
| `special` | No | - |
| `events` | No | - |

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/az-list/a?page=1');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "pageInfo": {
      "totalPages": 10,
      "currentPage": 1,
      "hasNextPage": true
    },
    "animes": [
      {
        "title": "Attack on Titan",
        "alternativeTitle": "Shingeki no Kyojin",
        "id": "attack-on-titan-112",
        "poster": "https://cdn.noitatnemucod.net/thumbnail/300x400/100/...",
        "episodes": {
          "sub": 25,
          "dub": 25,
          "eps": 25
        },
        "type": "TV",
        "duration": "24m"
      }
    ]
  }
}
```

---

### 5. GET Anime Detailed Info

Retrieve comprehensive information about a specific anime.

**Endpoint:**
```
GET /api/v1/anime/:id
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/anime/attack-on-titan-112');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "title": "Attack on Titan",
    "alternativeTitle": "Shingeki no Kyojin",
    "japanese": "進撃の巨人",
    "id": "attack-on-titan-112",
    "poster": "https://cdn.noitatnemucod.net/thumbnail/300x400/100/...",
    "rating": "R",
    "type": "TV",
    "episodes": {
      "sub": 25,
      "dub": 25,
      "eps": 25
    },
    "synopsis": "...",
    "synonyms": "AoT",
    "aired": {
      "from": "Apr 7, 2013",
      "to": "Sep 29, 2013"
    },
    "premiered": "Spring 2013",
    "duration": "24m",
    "status": "Finished Airing",
    "MAL_score": "8.52",
    "genres": [...],
    "studios": ["wit-studio"],
    "producers": [...],
    "moreSeasons": [...],
    "related": [...],
    "mostPopular": [...],
    "recommended": [...]
  }
}
```

---

### 6. GET Search Results

Search for anime by keyword with pagination support.

**Endpoint:**
```
GET /api/v1/search?keyword=:query&page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/search?keyword=one+piece&page=1');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "pageInfo": {
      "totalPages": 5,
      "currentPage": 1,
      "hasNextPage": true
    },
    "animes": [
      {
        "title": "One Piece",
        "alternativeTitle": "One Piece",
        "id": "one-piece-100",
        "poster": "https://cdn.noitatnemucod.net/thumbnail/300x400/100/...",
        "episodes": {
          "sub": 1100,
          "dub": 1050,
          "eps": 1100
        },
        "type": "TV",
        "duration": "24m"
      }
    ]
  }
}
```

---

### 7. GET Search Suggestions

Get autocomplete suggestions while searching for anime.

**Endpoint:**
```
GET /api/v1/suggestion?keyword=:query
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/suggestion?keyword=naruto');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": [
    {
      "title": "Naruto",
      "alternativeTitle": "Naruto",
      "poster": "https://cdn.noitatnemucod.net/thumbnail/300x400/100/...",
      "id": "naruto-677",
      "aired": "Oct 3, 2002",
      "type": "TV",
      "duration": "23m"
    }
  ]
}
```

---

### 8. Filter Anime

Filter anime based on multiple criteria.

**Endpoint:**
```
GET /api/v1/filter?type=:type&status=:status&rated=:rated&score=:score&season=:season&language=:language&start_date=:start_date&end_date=:end_date&sort=:sort&genres=:genres&page=:page
```

**Query Parameters:**

- `type` - all, tv, movie, ova, ona, special, music
- `status` - all, finished_airing, currently_airing, not_yet_aired
- `rated` - all, g, pg, pg-13, r, r+, rx
- `score` - all, appalling, horrible, very_bad, bad, average, fine, good, very_good, great, masterpiece
- `season` - all, spring, summer, fall, winter
- `language` - all, sub, dub, sub_dub
- `start_date` - YYYY-MM-DD format
- `end_date` - YYYY-MM-DD format
- `sort` - default, recently-added, recently-updated, score, name-az, released-date, most-watched
- `genres` - Comma-separated genre slugs (action, adventure, cars, comedy, dementia, demons, mystery, drama, ecchi, fantasy, game, historical, horror, kids, magic, martial_arts, mecha, music, parody, samurai, romance, school, sci-fi, shoujo, shoujo_ai, shounen, shounen_ai, space, sports, super_power, vampire, harem, slice_of_life, supernatural, military, police, psychological, thriller, seinen, josei, isekai)
- `page` - Page number (default: 1)

**Request Example:**

```javascript
const resp = await fetch('/api/v1/filter?type=tv&status=currently_airing&sort=score&genres=action,fantasy&page=1');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "pageInfo": {
      "totalPages": 20,
      "currentPage": 1,
      "hasNextPage": true
    },
    "animes": [...]
  }
}
```

---

### 9. GET Filter Options

Get all available filter options.

**Endpoint:**
```
GET /api/v1/filter/options
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/filter/options');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "types": [...],
    "statuses": [...],
    "ratings": [...],
    "scores": [...],
    "seasons": [...],
    "languages": [...],
    "sorts": [...],
    "genres": [...]
  }
}
```

---

### 10. GET Anime Characters

Retrieve character list for a specific anime.

**Endpoint:**
```
GET /api/v1/characters/:id?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/characters/one-piece-100?page=1');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "pageInfo": {
      "totalPages": 5,
      "currentPage": 1,
      "hasNextPage": true
    },
    "characters": [
      {
        "name": "Monkey D. Luffy",
        "image": "https://...",
        "id": "character:monkey-d-luffy-1",
        "role": "Main",
        "voiceActors": [...]
      }
    ]
  }
}
```

---

### 11. GET Character Details

Get detailed information about a character or voice actor.

**Endpoint:**
```
GET /api/v1/character/:id
```

**Request Example (Character):**

```javascript
const resp = await fetch('/api/v1/character/character:roronoa-zoro-7');
const data = await resp.json();
console.log(data);
```

**Request Example (Actor):**

```javascript
const resp = await fetch('/api/v1/character/people:kana-hanazawa-1');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "name": "Roronoa Zoro",
    "image": "https://...",
    "role": "Main",
    "animeAppearances": [...],
    "biography": "...",
    "voiceActors": [...]
  }
}
```

---

### 12. GET Anime Episodes

Retrieve the episode list for a specific anime.

**Endpoint:**
```
GET /api/v1/episodes/:id
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/episodes/steins-gate-3');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "totalEpisodes": 24,
    "episodes": [
      {
        "title": "Turning Point",
        "alternativeTitle": "Hajimari to Owari no Prologue",
        "episodeNumber": 1,
        "id": "steinsgate-3?ep=213",
        "isFiller": false
      }
    ]
  }
}
```

---

### 13. GET Anime Episode Servers

Get available streaming servers for a specific episode.

**Endpoint:**
```
GET /api/v1/servers?id=:episodeId
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/servers?id=steinsgate-3?ep=213');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "episodeNumber": 1,
    "sub": [
      {
        "serverName": "HD-1",
        "serverId": 4
      },
      {
        "serverName": "HD-2",
        "serverId": 1
      }
    ],
    "dub": [
      {
        "serverName": "HD-1",
        "serverId": 4
      }
    ]
  }
}
```

---

### 14. GET Anime Episode Streaming Links

Retrieve streaming links and metadata for a specific episode.

**Endpoint:**
```
GET /api/v1/stream?id=:episodeId&server=:server&type=:type
```

**Query Parameters:**

- `id` - Episode ID (required)
- `server` - Server name (default: hd-1)
- `type` - sub or dub (default: sub)

**Request Example:**

```javascript
const resp = await fetch('/api/v1/stream?id=102994&server=hd-2&type=sub');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "id": "steinsgate-3::ep=136197",
    "type": "dub",
    "link": {
      "file": "https://loda-lassan/master.m3u8",
      "type": "hls"
    },
    "tracks": [
      {
        "file": "https://loda-lassan/eng-2.vtt",
        "label": "English",
        "kind": "captions",
        "default": true
      },
      {
        "file": "https://loda-lassan.vtt",
        "kind": "thumbnails"
      }
    ],
    "intro": {
      "start": 81,
      "end": 170
    },
    "outro": {
      "start": 1315,
      "end": 1404
    },
    "server": "HD-2"
  }
}
```

---

### 15. GET Embedded Video Player

Returns an embedded video player HTML page for the specified episode.

**Endpoint (Path Parameters):**
```
GET /api/v1/embed/:server/:id/:type
```

**Endpoint (Query Parameters):**
```
GET /api/v1/embed?id=:episodeId&server=:server&type=:type
```

**Path/Query Parameters:**

- `server` - Server ID (hd-1, hd-2) (default: hd-2)
- `id` - Episode ID (required)
- `type` - Audio type: sub or dub (default: sub)

**Request Example (Path Params):**

```javascript
// Direct embed URL
window.location.href = '/api/v1/embed/hd-2/102994/sub';
```

**Request Example (Query Params):**

```javascript
// Embed with query parameters
window.location.href = '/api/v1/embed?id=102994&server=hd-2&type=sub';
```

**Response:**

Returns an HTML page with an embedded video player featuring:
- HLS.js video playback with adaptive quality
- Quality selection (Auto, 1080p, 720p, 480p, 360p)
- Playback speed control (0.25x - 2x)
- Subtitle support with customizable styling
- Skip intro/outro buttons (10 seconds)
- Fullscreen support
- Picture-in-picture mode
- Keyboard shortcuts
- Progress bar with intro/outro highlights

**Usage Example:**

```html
<!-- Embed in iframe -->
<iframe 
  src="https://your-api.com/api/v1/embed/hd-2/102994/sub"
  width="100%" 
  height="500px"
  frameborder="0"
  allowfullscreen
></iframe>
```

---

### 16. GET Proxy Stream/Subtitle

Proxies video streams and subtitle files with proper headers to bypass CORS restrictions.

**Endpoint:**
```
GET /api/v1/proxy?url=:url&referer=:referer
```

**Query Parameters:**

- `url` - URL to proxy (video stream M3U8 or subtitle VTT file) (required)
- `referer` - Referer header value (default: https://megacloud.tv)

**Request Example (Video Stream):**

```javascript
const streamUrl = encodeURIComponent('https://example.com/video/master.m3u8');
const referer = encodeURIComponent('https://megacloud.tv');
const resp = await fetch(`/api/v1/proxy?url=${streamUrl}&referer=${referer}`);
// Returns proxied M3U8 playlist with rewritten URLs
```

**Request Example (Subtitle):**

```javascript
const subtitleUrl = encodeURIComponent('https://example.com/subtitles/english.vtt');
const resp = await fetch(`/api/v1/proxy?url=${subtitleUrl}&referer=${referer}`);
// Returns proxied VTT subtitle file
```

**Response (M3U8 Playlist):**

```
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=2000000,RESOLUTION=1920x1080
/api/v1/proxy?url=https%3A%2F%2Fexample.com%2F1080p.m3u8&referer=https%3A%2F%2Fmegacloud.tv
#EXT-X-STREAM-INF:BANDWIDTH=1000000,RESOLUTION=1280x720
/api/v1/proxy?url=https%3A%2F%2Fexample.com%2F720p.m3u8&referer=https%3A%2F%2Fmegacloud.tv
```

**Response (VTT Subtitle):**

```
WEBVTT

00:00:01.000 --> 00:00:04.000
This is a subtitle line

00:00:05.000 --> 00:00:08.000
Another subtitle line
```

**Features:**

- Automatically rewrites M3U8 playlist URLs to proxy through the API
- Streams video segments directly without buffering
- Adds proper CORS headers
- Maintains original referer for source validation
- Supports both video streams and subtitle files

---

### 17. GET Anime Schedules (7 Days)

Retrieve anime schedules for 7 days starting from the given date (or today).

**Endpoint:**
```
GET /api/v1/schedules
```

**Query Parameters:**

- `date` - Start date in YYYY-MM-DD format (optional, defaults to today)

**Request Example:**

```javascript
const resp = await fetch('/api/v1/schedules?date=2024-01-01');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "2024-01-01": [
      {
        "id": "anime-id",
        "time": "10:30",
        "title": "Anime Title",
        "jname": "Japanese Title",
        "episode": 12
      }
    ],
    "2024-01-02": [ ... ]
  }
}
```

---

### 18. GET All Genres

Retrieve all available anime genres.

**Endpoint:**
```
GET /api/v1/genres
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/genres');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": [
    {
      "name": "Action",
      "slug": "action"
    },
    {
      "name": "Adventure",
      "slug": "adventure"
    }
  ]
}
```

---

### 19. GET Top Airing

Retrieve currently airing top anime.

**Endpoint:**
```
GET /api/v1/animes/top-airing?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/top-airing?page=1');
const data = await resp.json();
console.log(data);
```

---

### 20. GET Most Popular

Retrieve most popular anime.

**Endpoint:**
```
GET /api/v1/animes/most-popular?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/most-popular?page=1');
const data = await resp.json();
console.log(data);
```

---

### 21. GET Most Favorite

Retrieve most favorited anime.

**Endpoint:**
```
GET /api/v1/animes/most-favorite?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/most-favorite?page=1');
const data = await resp.json();
console.log(data);
```

---

### 22. GET Completed Anime

Retrieve completed anime series.

**Endpoint:**
```
GET /api/v1/animes/completed?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/completed?page=1');
const data = await resp.json();
console.log(data);
```

---

### 23. GET Recently Added

Retrieve recently added anime.

**Endpoint:**
```
GET /api/v1/animes/recently-added?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/recently-added?page=1');
const data = await resp.json();
console.log(data);
```

---

### 24. GET Recently Updated

Retrieve recently updated anime.

**Endpoint:**
```
GET /api/v1/animes/recently-updated?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/recently-updated?page=1');
const data = await resp.json();
console.log(data);
```

---

### 25. GET Top Upcoming

Retrieve top upcoming anime.

**Endpoint:**
```
GET /api/v1/animes/top-upcoming?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/top-upcoming?page=1');
const data = await resp.json();
console.log(data);
```

---

### 26. GET Anime by Genre

Retrieve anime filtered by specific genre.

**Endpoint:**
```
GET /api/v1/animes/genre/:genre?page=:page
```

**Available Genres:** action, adventure, cars, comedy, dementia, demons, drama, ecchi, fantasy, game, harem, historical, horror, isekai, josei, kids, magic, martial arts, mecha, military, music, mystery, parody, police, psychological, romance, samurai, school, sci-fi, seinen, shoujo, shoujo ai, shounen, shounen ai, slice of life, space, sports, super power, supernatural, thriller, vampire

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/genre/action?page=1');
const data = await resp.json();
console.log(data);
```

---

### 27. GET Anime by Producer

Retrieve anime filtered by production studio or company.

**Endpoint:**
```
GET /api/v1/animes/producer/:producer?page=:page
```

**Producer Examples:** bones, toei-animation, mappa, ufotable, kyoto-animation, wit-studio, madhouse, a-1-pictures, trigger, cloverworks

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/producer/bones?page=1');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "pageInfo": {
      "totalPages": 15,
      "currentPage": 1,
      "hasNextPage": true
    },
    "animes": [
      {
        "title": "My Hero Academia",
        "alternativeTitle": "Boku no Hero Academia",
        "id": "my-hero-academia-67",
        "poster": "https://cdn.noitatnemucod.net/thumbnail/300x400/100/...",
        "episodes": {
          "sub": 13,
          "dub": 13,
          "eps": 13
        },
        "type": "TV",
        "duration": "24m"
      }
    ]
  }
}
```

---

### 28. GET Subbed Anime

Retrieve anime with subtitles available.

**Endpoint:**
```
GET /api/v1/animes/subbed-anime?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/subbed-anime?page=1');
const data = await resp.json();
console.log(data);
```

---

### 29. GET Dubbed Anime

Retrieve anime with English dub available.

**Endpoint:**
```
GET /api/v1/animes/dubbed-anime?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/dubbed-anime?page=1');
const data = await resp.json();
console.log(data);
```

---

### 30. GET Anime Movies

Retrieve anime movies.

**Endpoint:**
```
GET /api/v1/animes/movie?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/movie?page=1');
const data = await resp.json();
console.log(data);
```

---

### 31. GET TV Series

Retrieve anime TV series.

**Endpoint:**
```
GET /api/v1/animes/tv?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/tv?page=1');
const data = await resp.json();
console.log(data);
```

---

### 32. GET OVA

Retrieve Original Video Animation (OVA) content.

**Endpoint:**
```
GET /api/v1/animes/ova?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/ova?page=1');
const data = await resp.json();
console.log(data);
```

---

### 33. GET ONA

Retrieve Original Net Animation (ONA) content.

**Endpoint:**
```
GET /api/v1/animes/ona?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/ona?page=1');
const data = await resp.json();
console.log(data);
```

---

### 34. GET Special

Retrieve special anime episodes.

**Endpoint:**
```
GET /api/v1/animes/special?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/special?page=1');
const data = await resp.json();
console.log(data);
```

---

### 35. GET Events

Retrieve anime events.

**Endpoint:**
```
GET /api/v1/animes/events?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/animes/events?page=1');
const data = await resp.json();
console.log(data);
```

---

### 36. Clear Redis Cache

Clear all cached data from Redis. Useful for forcing fresh data retrieval.

**Endpoint:**
```
GET /api/v1/admin/clear-cache
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/admin/clear-cache');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "success": true,
    "message": "Cache cleared successfully",
    "keysCleared": 5
  }
}
```

**Notes:**
- This endpoint clears ALL cached data
- Use sparingly as it will impact performance temporarily
- Returns the number of cache keys that were cleared
- If Redis is not configured, returns an error message

---

## Development

Pull requests and stars are always welcome. If you encounter any bug or want to add a new feature to this API, consider creating a new [issue](https://github.com/ryanwtf88/hianime-api/issues). If you wish to contribute to this project, feel free to make a pull request.

### Running in Development Mode

```bash
bun run dev
```

### Running in Production Mode

```bash
bun start
```

---

### 37. GET Anime News

Retrieve latest anime news articles.

**Endpoint:**
```
GET /api/v1/news?page=:page
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/news?page=1');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "news": [
      {
        "id": "article-id",
        "title": "Article Title",
        "description": "...",
        "thumbnail": "https://...",
        "uploadedAt": "2 hours ago"
      }
    ]
  }
}
```

---

### 38. GET Watch2gether Rooms

Retrieve active watch party rooms.

**Endpoint:**
```
GET /api/v1/watch2gether?room=:filter
```

**Filters:** `all`, `on_air`, `scheduled`, `waiting`, `ended`

**Request Example:**

```javascript
const resp = await fetch('/api/v1/watch2gether?room=on_air');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "rooms": [
      {
        "id": "1518869",
        "animeId": "1518869",
        "animeTitle": "Fullmetal Alchemist: Brotherhood",
        "roomTitle": "Watch Fullmetal Alchemist: Brotherhood together",
        "poster": "https://cdn.noitatnemucod.net/thumbnail/300x400/100/...",
        "episode": "Episode 1",
        "type": "SUB",
        "status": "🤟 Waiting",
        "createdBy": "John",
        "createdAt": "15 minutes ago",
        "url": "/watch2gether/1518869",
        "playerUrl": "http://localhost:5000/api/v1/watch2gether/player/1518869"
      }
    ],
    "total": 10
  }
}
```

---

### 38.1. GET Watch2gether Player Data

Get player data for a specific watch2gether room including anime info and embed URL.

**Endpoint:**
```
GET /api/v1/watch2gether/player/:id?server=:server
```

**Parameters:**
- `id` (path, required): Watch2gether room ID
- `server` (query, optional): Server to use (HD-1, HD-2, HD-3), default: HD-2

**Request Example:**

```javascript
const resp = await fetch('/api/v1/watch2gether/player/1518869?server=HD-2');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "roomId": "1518869",
    "roomTitle": "Watch Fullmetal Alchemist: Brotherhood together",
    "animeId": "fullmetal-alchemist-brotherhood-1",
    "animeTitle": "Fullmetal Alchemist: Brotherhood",
    "episode": 1,
    "episodeId": "1",
    "type": "sub",
    "server": "HD-2",
    "embedUrl": "http://localhost:5000/api/v1/embed/HD-2/fullmetal-alchemist-brotherhood-1?ep=1&type=sub",
    "createdBy": "John",
    "status": "35"
  }
}
```

**Usage:**
Use the `embedUrl` to embed the video player in your frontend application. The endpoint automatically detects the anime, episode, and type (sub/dub/raw) from the watch2gether room.

---

### 39. GET Random Anime

Retrieve a random anime ID.

**Endpoint:**
```
GET /api/v1/random
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/random');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "id": "anime-id-123"
  }
}
```

---

## Contributors

Thanks to the following people for keeping this project alive and relevant:

<a href="https://github.com/ryanwtf88/hianime-api/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ryanwtf88/hianime-api" alt="Contributors" />
</a>

Want to contribute? Check out our [contribution guidelines](https://github.com/ryanwtf88/hianime-api/blob/main/CONTRIBUTING.md) and feel free to submit a pull request!

---

## Acknowledgments

Special thanks to the following projects for inspiration and reference:

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
