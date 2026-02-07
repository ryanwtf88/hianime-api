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
    
    // If using alternative source (aniwatchtv.to), map servers
    if (useAlternative) {
      ['sub', 'dub', 'raw'].forEach(type => {
        if (response[type]) {
          response[type] = response[type].map(server => {
            // Map aniwatchtv server ID 4 (VidSrc) to HD-1
            if (server.index === 4) {
              return { ...server, name: 'HD-1' };
            }
            // Keep MegaCloud (server ID 1) as is for HD-3 mapping
            return server;
          });
        }
      });
    }
    
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
  
  // Merge servers: use aniwatchtv VidSrc as HD-1, hianime HD-2, aniwatchtv MegaCloud as HD-3
  const mergedServers = {
    episode: hianimeServers.episode,
    sub: [],
    dub: [],
    raw: [],
  };
  
  ['sub', 'dub', 'raw'].forEach(type => {
    // Add HD-1 from aniwatchtv (VidSrc - server ID 4)
    const aniwatchHD1 = aniwatchServers[type]?.find(s => s.name === 'HD-1');
    if (aniwatchHD1) {
      mergedServers[type].push({ ...aniwatchHD1, source: 'aniwatchtv' });
    }
    
    // Add HD-2 from hianime (MegaCloud - server ID 1)
    const hianimeHD2 = hianimeServers[type]?.find(s => s.name === 'HD-2');
    if (hianimeHD2) {
      mergedServers[type].push({ ...hianimeHD2, source: 'hianime' });
    }
    
    // Add HD-3 from aniwatchtv (MegaCloud - server ID 1)
    // Map aniwatchtv MegaCloud to HD-3
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
