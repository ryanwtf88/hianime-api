// Function to generate swagger docs with dynamic server URL
export const getSwaggerDocs = (baseUrl) => ({
  openapi: '3.0.0',
  info: {
    title: 'hianime-api',
    version: '1.0.6', // Update this when package.json version changes
    description: 'API Documentation For HiAnime Content Endpoints',
  },
  servers: [
    {
      url: `${baseUrl}/api/v1`,
    },
  ],
  paths: {
    '/home': {
      get: {
        summary: 'Fetch homepage content',
        description:
          'Includes spotlight, top airing, trending, most popular/favorite, new added, updated, etc.',
        responses: {
          200: {
            description: 'Success',
          },
        },
      },
    },
    '/animes/az-list/{letter}': {
      get: {
        summary: 'A-Z anime list',
        parameters: [
          {
            name: 'letter',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              enum: [
                'all',
                'other',
                '0-9',
                'a',
                'b',
                'c',
                'd',
                'e',
                'f',
                'g',
                'h',
                'i',
                'j',
                'k',
                'l',
                'm',
                'n',
                'o',
                'p',
                'q',
                'r',
                's',
                't',
                'u',
                'v',
                'w',
                'x',
                'y',
                'z',
              ],
            },
            description: 'Alphabet letter or special code (0-9, all, other)',
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
          },
        ],
        responses: {
          200: {
            description: 'Anime A-Z list',
          },
        },
      },
    },
    '/animes/top-airing': {
      get: {
        summary: 'Top airing anime',
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/animes/most-popular': {
      get: {
        summary: 'Most popular anime',
        parameters: [
          { name: 'page', in: 'query', required: true, schema: { type: 'integer', default: 1 } },
        ],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/animes/most-favorite': {
      get: {
        summary: 'Most favorite anime',
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/animes/completed': {
      get: {
        summary: 'Completed anime series',
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/animes/recently-added': {
      get: {
        summary: 'Recently added anime',
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/animes/recently-updated': {
      get: {
        summary: 'Recently updated anime',
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/animes/top-upcoming': {
      get: {
        summary: 'Top upcoming anime',
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/animes/genre/{genre}': {
      get: {
        summary: 'Anime by genre',
        parameters: [
          {
            name: 'genre',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              enum: [
                'action',
                'adventure',
                'cars',
                'comedy',
                'dementia',
                'demons',
                'drama',
                'ecchi',
                'fantasy',
                'game',
                'harem',
                'historical',
                'horror',
                'isekai',
                'josei',
                'kids',
                'magic',
                'martial arts',
                'mecha',
                'military',
                'music',
                'mystery',
                'parody',
                'police',
                'psychological',
                'romance',
                'samurai',
                'school',
                'sci-fi',
                'seinen',
                'shoujo',
                'shoujo ai',
                'shounen',
                'shounen ai',
                'slice of life',
                'space',
                'sports',
                'super power',
                'supernatural',
                'thriller',
                'vampire',
              ],
            },
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
          },
        ],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/animes/subbed-anime': {
      get: {
        summary: 'Subbed anime list',
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/animes/dubbed-anime': {
      get: {
        summary: 'Dubbed anime list',
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/animes/movie': {
      get: {
        summary: 'Anime movies',
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/animes/tv': {
      get: {
        summary: 'Anime TV series',
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/animes/ova': {
      get: {
        summary: 'Anime OVAs',
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/animes/ona': {
      get: {
        summary: 'Anime ONAs',
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/animes/special': {
      get: {
        summary: 'Anime Specials',
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/animes/events': {
      get: {
        summary: 'Anime Events',
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/anime/{id}': {
      get: {
        summary: 'Anime detail by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/search': {
      get: {
        summary: 'Search anime',
        parameters: [
          { name: 'keyword', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        ],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/filter': {
      get: {
        summary: 'Filter anime',
        parameters: [
          { name: 'keyword', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },

          {
            name: 'genres',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              enum: [
                'action',
                'adventure',
                'cars',
                'comedy',
                'dementia',
                'demons',
                'mystery',
                'drama',
                'ecchi',
                'fantasy',
                'game',
                'historical',
                'horror',
                'kids',
                'magic',
                'martial_arts',
                'mecha',
                'music',
                'parody',
                'samurai',
                'romance',
                'school',
                'sci-fi',
                'shoujo',
                'shoujo_ai',
                'shounen',
                'shounen_ai',
                'space',
                'sports',
                'super_power',
                'vampire',
                'harem',
                'slice_of_life',
                'supernatural',
                'military',
                'police',
                'psychological',
                'thriller',
                'seinen',
                'josei',
                'isekai',
              ],
            },
          },
          {
            name: 'type',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: ['all', 'movie', 'tv', 'ova', 'special', 'music'] },
          },
          {
            name: 'status',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              enum: ['all', 'finished_airing', 'currently_airing', 'not_yet_aired'],
            },
          },
          {
            name: 'rated',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: ['all', 'g', 'pg', 'pg-13', 'r', 'r+', 'rx'] },
          },
          {
            name: 'score',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              enum: [
                'all',
                'appalling',
                'horrible',
                'very_bad',
                'bad',
                'average',
                'fine',
                'good',
                'very_good',
                'great',
                'masterpiece',
              ],
            },
          },
          {
            name: 'season',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: ['all', 'spring', 'summer', 'fall', 'winter'] },
          },
          {
            name: 'language',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: ['all', 'sub', 'dub', 'sub_dub'] },
          },
        ],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/suggestion': {
      get: {
        summary: 'Search suggestions',
        parameters: [
          { name: 'keyword', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        ],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/characters/{id}': {
      get: {
        summary: 'Anime characters by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        ],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/character/{id}': {
      get: {
        summary: 'Character or actor detail',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/episodes/{id}': {
      get: {
        summary: 'Episodes by anime ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/servers': {
      get: {
        summary: 'Episode servers',
        parameters: [{ name: 'id', in: 'query', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/stream': {
      get: {
        summary: 'Stream episode',
        parameters: [
          { name: 'id', in: 'query', required: true, schema: { type: 'string' } },
          {
            name: 'type',
            in: 'query',
            schema: { type: 'string', enum: ['sub', 'dub', 'raw'], default: 'sub' },
          },
          { name: 'server', in: 'query', schema: { type: 'string', default: 'hd-1' } },
        ],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/schedules': {
      get: {
        summary: 'Get anime schedule',
        description: 'Fetches the schedule of anime releases',
        responses: { 200: { description: 'Success' } },
      },
    },
    '/schedule/next/{id}': {
      get: {
        summary: 'Get next episode schedule',
        description: 'Fetches the next episode schedule for a specific anime',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/filter/options': {
      get: {
        summary: 'Get filter options',
        description: 'Returns available filter options for anime search',
        responses: { 200: { description: 'Success' } },
      },
    },
    '/genres': {
      get: {
        summary: 'Get all genres',
        description: 'Fetches a list of all available anime genres',
        responses: { 200: { description: 'Success' } },
      },
    },
    '/animes/producer/{producer}': {
      get: {
        summary: 'Anime by producer',
        description: 'Fetches anime filtered by production studio/company',
        parameters: [
          {
            name: 'producer',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Producer/studio name slug',
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
          },
        ],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/news': {
      get: {
        summary: 'Get anime news',
        description: 'Fetches latest anime news articles',
        parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } }],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/watch2gether': {
      get: {
        summary: 'Get watch2gether rooms',
        description: 'Fetches active watch party rooms',
        parameters: [
          {
            name: 'room',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['all', 'on_air', 'scheduled', 'waiting', 'ended'],
              default: 'all',
            },
          },
        ],
        responses: { 200: { description: 'Success' } },
      },
    },
    '/watch2gether/player/{id}': {
      get: {
        summary: 'Watch2gether player data',
        description: 'Returns player data for a watch2gether room including embed URL',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Watch2gether room ID',
          },
          {
            name: 'server',
            in: 'query',
            schema: { type: 'string', enum: ['HD-1', 'HD-2', 'HD-3'], default: 'HD-2' },
            description: 'Server to use for streaming',
          },
        ],
        responses: {
          200: {
            description: 'Player data with embed URL',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        roomId: { type: 'string' },
                        roomTitle: { type: 'string' },
                        animeId: { type: 'string' },
                        animeTitle: { type: 'string' },
                        episode: { type: 'number' },
                        episodeId: { type: 'string' },
                        type: { type: 'string', enum: ['sub', 'dub', 'raw'] },
                        server: { type: 'string' },
                        embedUrl: { type: 'string' },
                        createdBy: { type: 'string' },
                        status: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/embed/{server}/{id}/{type}': {
      get: {
        summary: 'Embedded video player',
        description: 'Returns an embedded video player for the specified episode',
        parameters: [
          {
            name: 'server',
            in: 'path',
            required: true,
            schema: { type: 'string', enum: ['hd-1', 'hd-2', 'hd-3'], default: 'hd-1' },
            description: 'Server ID',
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Episode ID',
          },
          {
            name: 'type',
            in: 'path',
            required: true,
            schema: { type: 'string', enum: ['sub', 'dub', 'raw'], default: 'sub' },
            description: 'Audio type',
          },
        ],
        responses: { 200: { description: 'HTML video player page' } },
      },
    },
    '/embed': {
      get: {
        summary: 'Embedded video player (query params)',
        description: 'Returns an embedded video player using query parameters',
        parameters: [
          {
            name: 'id',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'Episode ID',
          },
          {
            name: 'server',
            in: 'query',
            schema: { type: 'string', enum: ['hd-1', 'hd-2', 'hd-3'], default: 'hd-1' },
            description: 'Server ID',
          },
          {
            name: 'type',
            in: 'query',
            schema: { type: 'string', enum: ['sub', 'dub', 'raw'], default: 'sub' },
            description: 'Audio type',
          },
        ],
        responses: { 200: { description: 'HTML video player page' } },
      },
    },
    '/proxy': {
      get: {
        summary: 'Proxy video streams and subtitles',
        description:
          'Proxies video streams and subtitles with proper headers to bypass CORS restrictions',
        parameters: [
          {
            name: 'url',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'URL to proxy (video stream or subtitle file)',
          },
          {
            name: 'referer',
            in: 'query',
            schema: { type: 'string', default: 'https://megacloud.tv' },
            description: 'Referer header value',
          },
        ],
        responses: {
          200: { description: 'Proxied content (video stream or subtitle file)' },
          400: { description: 'Missing URL parameter' },
          500: { description: 'Proxy error' },
        },
      },
    },
    '/random': {
      get: {
        summary: 'Get random anime',
        description: 'Fetches a random anime ID',
        responses: { 200: { description: 'Success' } },
      },
    },
  },
});

export default getSwaggerDocs;
