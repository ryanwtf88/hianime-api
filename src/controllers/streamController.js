import { validationError } from '../utils/errors.js';
import { getServers } from './serversController.js';
import { extractStream } from '../extractor/extractStream.js';

const streamController = async (c) => {
  let { id, server = 'HD-1', type = 'sub' } = c.req.query();

  // Validate required parameters
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw new validationError('id is required and must be a non-empty string');
  }

  // Trim and normalize inputs
  id = id.trim();
  server = server.trim().toUpperCase();
  type = type.trim().toLowerCase();

  // Validate episode format
  if (!id.includes('ep=')) {
    throw new validationError('invalid id format - must include episode parameter (ep=)', {
      example: 'watch/steinsgate-3?ep=213',
      provided: id,
    });
  }

  // Validate type parameter
  const validTypes = ['sub', 'dub'];
  if (!validTypes.includes(type)) {
    throw new validationError('type must be either "sub" or "dub"', {
      validTypes,
      provided: type,
    });
  }

  try {
    // Get available servers
    const servers = await getServers(id);

    // Validate server exists
    if (!servers[type] || servers[type].length === 0) {
      throw new validationError(`no ${type} servers available for this episode`, {
        availableTypes: Object.keys(servers).filter(k => servers[k]?.length > 0),
      });
    }

    const selectedServer = servers[type].find((el) => el.name === server);
    
    if (!selectedServer) {
      throw new validationError('server not found', {
        requestedServer: server,
        availableServers: servers[type].map(s => s.name),
      });
    }

    // Extract stream with error handling
    const response = await extractStream({ selectedServer, id });
    
    if (!response) {
      throw new validationError('failed to extract stream - no response from extractor');
    }

    // Check if extraction was successful
    if (response.error) {
      throw new validationError('stream extraction failed', {
        error: response.error,
        server: selectedServer.name,
      });
    }

    if (!response.link?.file) {
      throw new validationError('no valid stream link found', {
        server: selectedServer.name,
        type,
      });
    }

    return response;
  } catch (error) {
    // Re-throw validation errors
    if (error instanceof validationError) {
      throw error;
    }

    // Wrap other errors
    console.error('Stream controller error:', error.message);
    throw new validationError('failed to get stream', {
      error: error.message,
      id,
      server,
      type,
    });
  }
};

export default streamController;
