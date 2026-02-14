import axios from 'axios';
import { validationError } from '../utils/errors.js';
import config from '../config/config.js';
import { extractServers } from '../extractor/extractServers.js';

export const getServers = async (id, useAlternative = false) => {
  const episode = id.split('ep=').at(-1);
  const ajaxUrl = `/ajax/v2/episode/servers?episodeId=${episode}`;
  const Referer = `/watch/${id.replace('::', '?')}`;

  // Use baseurl2 (aniwatchtv.to) if alternative is requested
  const baseUrl = useAlternative ? config.baseurl2 : config.baseurl;

  try {
    const { data } = await axios.get(baseUrl + ajaxUrl, {
      headers: {
        Referer: baseUrl + Referer,
        ...config.headers,
      },
    });

    const response = extractServers(data.html);

    // Map servers for both sources
    ['sub', 'dub', 'raw'].forEach(type => {
      if (response[type]) {
        response[type] = response[type].map(server => {
          if (useAlternative) {
            // AniWatch: Keep MegaCloud (ID 1) as is for HD-3 mapping later
            return server;
          } else {
            // HiAnime: Map VidStreaming (ID 4) to HD-1
            if (server.index === 4) {
              return { ...server, name: 'HD-1' };
            }
            // HiAnime: Map MegaCloud (ID 1) to HD-2
            if (server.index === 1) {
              return { ...server, name: 'HD-2' };
            }
            return server;
          }
        });
      }
    });

    return response;
  } catch (err) {
    console.log(err.message);
    throw new validationError('make sure given endpoint is correct', {
      validIdEx: 'watch/steinsgate-3?ep=213',
    });
  }
};

const serversController = async (c) => {
  const id = c.req.query('id');

  if (!id) throw new validationError('id is required');

  // Get servers from both sources
  const hianimeServers = await getServers(id, false);
  const aniwatchServers = await getServers(id, true);

  // Merge servers:
  // HD-1: HiAnime (VidStreaming - ID 4)
  // HD-2: HiAnime (MegaCloud - ID 1)
  // HD-3: AniWatch (MegaCloud - ID 1)
  const mergedServers = {
    episode: hianimeServers.episode,
    sub: [],
    dub: [],
    raw: [],
  };

  ['sub', 'dub', 'raw'].forEach(type => {
    // Add HD-1 from HiAnime
    const hianimeHD1 = hianimeServers[type]?.find(s => s.name === 'HD-1');
    if (hianimeHD1) {
      mergedServers[type].push({ ...hianimeHD1, source: 'hianime' });
    }

    // Add HD-2 from HiAnime
    const hianimeHD2 = hianimeServers[type]?.find(s => s.name === 'HD-2');
    if (hianimeHD2) {
      mergedServers[type].push({ ...hianimeHD2, source: 'hianime' });
    }

    // Add HD-3 from AniWatch (MegaCloud)
    const aniwatchMegaCloud = aniwatchServers[type]?.find(s => s.index === 1);
    if (aniwatchMegaCloud) {
      mergedServers[type].push({
        ...aniwatchMegaCloud,
        name: 'HD-3',
        source: 'aniwatchtv'
      });
    }
  });

  return mergedServers;
};

export default serversController;
