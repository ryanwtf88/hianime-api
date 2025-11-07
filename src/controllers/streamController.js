import { validationError } from '../utils/errors.js';
import { getServers } from './serversController.js';
import { extractStream } from '../extractor/extractStream.js';

const streamController = async (c) => {
  let { id, ep, server = 'HD-1', type = 'sub' } = c.req.query();

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
        '/api/v1/stream?id=steinsgate-3&ep=213&server=hd-1&type=sub',
        '/api/v1/stream?id=watch/steinsgate-3&ep=213&server=hd-1&type=sub',
      ],
      provided: { id, ep },
    });
  }

  // Construct the full ID in the correct format
  const fullId = `watch/${animeId}?ep=${episodeNum}`;

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

  console.log('[streamController] Calling extractStream with:', { selectedServer, fullId });
  
  const response = await extractStream({ selectedServer, id: fullId });
  
  console.log('[streamController] extractStream response:', response);
  
  if (!response) {
    throw new validationError('Failed to extract stream - no response from extractor', {
      server,
      id: fullId,
      type,
      selectedServerId: selectedServer.id,
    });
  }

  // Check for both response formats
  const hasValidLink = response.link?.file || response.streamingLink;
  
  if (!hasValidLink) {
    throw new validationError('Stream extraction failed - no valid stream link found', {
      server,
      id: fullId,
      type,
      responseKeys: Object.keys(response),
      response,
    });
  }

  return response;
};

export default streamController;
