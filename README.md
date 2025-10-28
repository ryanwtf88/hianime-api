# hianime-api

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
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
  - [Render Deployment](#render-deployment)
  - [Replit Deployment](#replit-deployment)
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
  - [All Genres](#15-get-all-genres)
  - [Top Airing](#16-get-top-airing)
  - [Most Popular](#17-get-most-popular)
  - [Most Favorite](#18-get-most-favorite)
  - [Completed Anime](#19-get-completed-anime)
  - [Recently Added](#20-get-recently-added)
  - [Recently Updated](#21-get-recently-updated)
  - [Top Upcoming](#22-get-top-upcoming)
  - [Genre List](#23-get-anime-by-genre)
  - [Subbed Anime](#24-get-subbed-anime)
  - [Dubbed Anime](#25-get-dubbed-anime)
  - [Movies](#26-get-anime-movies)
  - [TV Series](#27-get-tv-series)
  - [OVA](#28-get-ova)
  - [ONA](#29-get-ona)
  - [Special](#30-get-special)
  - [Events](#31-get-events)
- [Development](#development)
- [Contributors](#contributors)
- [Acknowledgments](#acknowledgments)
- [Support](#support)

---

## Overview

hianime-api is a comprehensive RESTful API that provides endpoints to retrieve anime details, episodes, and streaming links by scraping content from hianime.to. Built with modern web technologies, it offers a robust solution for anime content aggregation.

## Important Notice

> **⚠️ Disclaimer**

1. This API is recommended for **personal use only**. Deploy your own instance and customize it as needed.

2. This API is just an **unofficial API for [hianime.to](https://hianime.to)** and is in no other way officially related to the same.

3. The content that this API provides is not mine, nor is it hosted by me. These belong to their respective owners. This API just demonstrates how to build an API that scrapes websites and uses their content.

---

## Installation

### Prerequisites

Make sure you have Bun.js installed on your system.

**Install Bun.js:**

```bash
https://bun.sh/docs/installation
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

**Build the Docker image:**

```bash
docker build -t hianime-api .
```

**Run the container:**

```bash
docker run -p 3030:3030 hianime-api
```

**With environment variables:**

```bash
docker run -p 3030:3030 \
  -e NODE_ENV=production \
  -e PORT=3030 \
  hianime-api
```

**Using Docker Compose:**

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  hianime-api:
    build: .
    ports:
      - "3030:3030"
    environment:
      - NODE_ENV=production
      - PORT=3030
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3030/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Then run:

```bash
docker-compose up -d
```

### Render Deployment

**One-Click Deploy:**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/ryanwtf88/hianime-api)

**Manual Deployment:**

1. Fork or clone the repository to your GitHub account
2. Create a new Web Service on [Render Dashboard](https://dashboard.render.com/)
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `hianime-api`
   - **Region**: Choose your preferred region
   - **Branch**: `main`
   - **Runtime**: Docker
   - **Instance Type**: Free or paid plan
5. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=3030`
6. Click "Create Web Service"

**Environment Variables:**

| Key | Value | Required |
|-----|-------|----------|
| `NODE_ENV` | `production` | Yes |
| `PORT` | `3030` | Yes |
| `UPSTASH_REDIS_REST_URL` | Your Upstash Redis URL | Optional* |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash Redis Token | Optional* |

*Required if you're using Redis for caching

### Replit Deployment

1. Import this repository into Replit
2. Click the Run button
3. Your API will be available at your Replit URL

For detailed deployment instructions, troubleshooting, and best practices, see the [DEPLOYMENT.md](https://github.com/ryanwtf88/hianime-api/blob/master/DEPLOYMENT.md) guide.

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

### 2. GET Anime Schedule

Retrieve the schedule of anime releases.

**Endpoint:**
```
GET /api/v1/schadule
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/schadule');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "scheduledAnimes": [...]
  }
}
```

---

### 3. GET Next Episode Schedule

Get the next episode schedule for a specific anime.

**Endpoint:**
```
GET /api/v1/schadule/next/:id
```

**Request Example:**

```javascript
const resp = await fetch('/api/v1/schadule/next/one-piece-100');
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
    "studios": "Wit Studio",
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
const resp = await fetch('/api/v1/stream?id=steinsgate-3?ep=213&server=hd-1&type=sub');
const data = await resp.json();
console.log(data);
```

**Response Schema:**

```javascript
{
  "success": true,
  "data": {
    "tracks": [
      {
        "file": "https://...",
        "label": "English",
        "kind": "captions"
      }
    ],
    "intro": {
      "start": 75,
      "end": 165
    },
    "outro": {
      "start": 1330,
      "end": 1419
    },
    "sources": [
      {
        "url": "https://...",
        "type": "hls"
      }
    ],
    "anilistID": 9253,
    "malID": 9253
  }
}
```

---

### 15. GET All Genres

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

### 16. GET Top Airing

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

### 17. GET Most Popular

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

### 18. GET Most Favorite

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

### 19. GET Completed Anime

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

### 20. GET Recently Added

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

### 21. GET Recently Updated

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

### 22. GET Top Upcoming

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

### 23. GET Anime by Genre

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

### 24. GET Subbed Anime

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

### 25. GET Dubbed Anime

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

### 26. GET Anime Movies

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

### 27. GET TV Series

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

### 28. GET OVA

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

### 29. GET ONA

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

### 30. GET Special

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

### 31. GET Events

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

**Made with ❤️ by RY4N**

[Report Bug](https://github.com/ryanwtf88/hianime-api/issues) • [Request Feature](https://github.com/ryanwtf88/hianime-api/issues)

</div>
