import axios from 'axios';
import { validationError } from '../utils/errors.js';
import config from '../config/config.js';
import { extractServers } from '../extractor/extractServers.js';

export const getServers = async (id) => {
  if (!id || typeof id !== 'string') {
    throw new validationError('id must be a non-empty string');
  }

  const episode = id.split('ep=').at(-1);
  
  if (!episode || isNaN(episode)) {
    throw new validationError('invalid episode id format', {
      validExample: 'watch/steinsgate-3?ep=213',
      provided: id,
    });
  }

  const ajaxUrl = `/ajax/v2/episode/servers?episodeId=${episode}`;
  const Referer = `/watch/${id.replace('::', '?')}`;

  try {
    const { data } = await axios.get(config.baseurl + ajaxUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': config.headers['User-Agent'],
        'Referer': config.baseurl + Referer,
        'X-Requested-With': 'XMLHttpRequest',
        ...config.headers,
      },
    });

    if (!data || !data.html) {
      throw new Error('Invalid response structure - missing html data');
    }

    const response = extractServers(data.html);
    
    // Validate extraction result
    if (!response || (!response.sub && !response.dub)) {
      throw new Error('No servers found in response');
    }

    return response;
  } catch (err) {
    console.error('Error fetching servers:', err.message);
    
    if (err instanceof validationError) {
      throw err;
    }

    throw new validationError('failed to fetch servers - please verify the id is correct', {
      validExample: 'watch/steinsgate-3?ep=213',
      provided: id,
      error: err.message,
    });
  }
};

const serversController = async (c) => {
  const id = c.req.query('id');

  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw new validationError('id parameter is required and must be a non-empty string', {
      validExample: 'watch/steinsgate-3?ep=213',
    });
  }

  const response = await getServers(id.trim());

  return response;
};

export default serversController;
