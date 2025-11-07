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

  // Handle both formats:
  // 1. Combined: id=watch/steinsgate-3?ep=213
  // 2. Separate: id=steinsgate-3&ep=213 or id=watch/steinsgate-3&ep=213
  let fullId = id;
  
  if (ep) {
    // If ep is provided separately, construct the full id
    const baseId = id.replace(/^watch\//, '').replace(/\?ep=\d+$/, '');
    fullId = `watch/${baseId}?ep=${ep}`;
  } else if (!id.includes('ep=')) {
    throw new validationError('episode parameter is required', {
      validFormats: [
        'id=watch/steinsgate-3?ep=213 (combined)',
        'id=steinsgate-3&ep=213 (separate)',
      ],
      provided: { id, ep },
    });
  } else {
    // Ensure watch/ prefix exists
    if (!id.startsWith('watch/')) {
      fullId = `watch/${id}`;
    }
  }

  const response = await getServers(fullId);

  return response;
};

export default serversController;
