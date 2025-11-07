import { validationError } from '../utils/errors.js';
import { getServers } from './serversController.js';
import { extractStream } from '../extractor/extractStream.js';

const streamController = async (c) => {
  let { id, ep, server = 'HD-1', type = 'sub' } = c.req.query();

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
        'id=watch/steinsgate-3&ep=213 (separate with watch prefix)',
      ],
      provided: { id, ep },
    });
  } else {
    // Ensure watch/ prefix exists
    if (!id.startsWith('watch/')) {
      fullId = `watch/${id}`;
    }
  }

  server = server.toUpperCase();

  const servers = await getServers(fullId);

  const selectedServer = servers[type].find((el) => el.name === server);
  if (!selectedServer) {
    throw new validationError('server not found', { 
      requestedServer: server,
      availableServers: servers[type]?.map(s => s.name) || [],
      type,
    });
  }

  const response = await extractStream({ selectedServer, id: fullId });
  
  if (!response) {
    throw new validationError('Failed to extract stream - no response from extractor', {
      server,
      id: fullId,
      type,
    });
  }

  if (!response.link?.file && !response.streamingLink) {
    throw new validationError('Stream extraction failed - no valid stream link found', {
      server,
      id: fullId,
      type,
      response,
    });
  }

  return response;
};

export default streamController;
