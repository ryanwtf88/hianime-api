import axios from 'axios';
import { validationError } from '../utils/errors.js';
import config from '../config/config.js';
import { extractServers } from '../extractor/extractServers.js';

export const getServers = async (id) => {
  const episode = id.split('ep=').at(-1);
  const ajaxUrl = `/ajax/v2/episode/servers?episodeId=${episode}`;
  const Referer = `/watch/${id.replace('::', '?').replace(/^watch\//, '')}`;

  try {
    const { data } = await axios.get(config.baseurl + ajaxUrl, {
      headers: {
        Referer: config.baseurl + Referer,
        ...config.headers,
      },
    });

    const response = extractServers(data.html);
    return response;
  } catch (err) {
    console.error('Error fetching servers:', err.message);
    throw new validationError('failed to fetch servers', {
      validExamples: [
        'id=watch/steinsgate-3?ep=213',
        'id=steinsgate-3&ep=213',
      ],
      error: err.message,
    });
  }
};

const serversController = async (c) => {
  let { id, ep } = c.req.query();

  if (!id) throw new validationError('id is required');

  // Parse id to handle various formats
  let animeId = id;
  let episodeNum = ep;

  // Check if id contains ?ep= pattern (common mistake: /api/v1/servers?id=steinsgate-3?ep=213)
  if (id.includes('?ep=')) {
    const parts = id.split('?ep=');
    animeId = parts[0].replace(/^watch\//, '');
    episodeNum = episodeNum || parts[1];
  }

  // Remove watch/ prefix if exists
  animeId = animeId.replace(/^watch\//, '');

  // Validate episode number
  if (!episodeNum) {
    throw new validationError('episode parameter is required', {
      validFormats: [
        '/api/v1/servers?id=steinsgate-3&ep=213',
        '/api/v1/servers?id=watch/steinsgate-3&ep=213',
      ],
      provided: { id, ep },
    });
  }

  // Construct the full ID in the correct format
  const fullId = `watch/${animeId}?ep=${episodeNum}`;

  const response = await getServers(fullId);

  return response;
};

export default serversController;
