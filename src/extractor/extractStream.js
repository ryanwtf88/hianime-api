import { megacloud } from '../parsers/decryptor/megacloud.js';
import config from '../config/config.js';

export const extractStream = async ({ selectedServer, id }) => {
  if (selectedServer.name === 'HD-4') {
    const url = `https://megaplay.buzz/stream/s-2/${id.split('ep=').pop()}/${selectedServer.type}`;
    return { streamingLink: url, servers: selectedServer.name };
  }

  const streamingLink = await megacloud({ selectedServer, id });
  
  // Return direct URL - CDN blocks Cloudflare Workers, but allows browser access
  // The proxy endpoint is still available for clients that need it
  // Client can choose to use: /api/v1/proxy?url=ENCODED_URL&referer=https%3A%2F%2Fmegacloud.tv
  
  return streamingLink;
};
