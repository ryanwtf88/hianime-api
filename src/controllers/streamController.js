import { validationError } from '../utils/errors.js';
import { getServers } from './serversController.js';
import { extractStream } from '../extractor/extractStream.js';

const streamController = async (c) => {
  let { id, server = 'HD-1', type = 'sub' } = c.req.query();

  if (!id) throw new validationError('id is required');

  server = server.toUpperCase();
  const episode = id.includes('ep=');
  if (!episode) throw new validationError('episode  is not valid');

  const servers = await getServers(id);

  const selectedServer = servers[type].find((el) => el.name === server);
  if (!selectedServer) throw new validationError('invalid or server not found', { server });

  const response = await extractStream({ selectedServer, id });
  
  if (!response) {
    throw new validationError('Failed to extract stream - no response from extractor', {
      server,
      id,
      type,
    });
  }

  if (!response.link?.file && !response.streamingLink) {
    throw new validationError('Stream extraction failed - no valid stream link found', {
      server,
      id,
      type,
      response,
    });
  }

  return response;
};

export default streamController;
