import { megacloud } from '../parsers/decryptor/megacloud.js';
import config from '../config/config.js';

export const extractStream = async ({ selectedServer, id }) => {
  if (selectedServer.name === 'HD-4') {
    const url = `https://megaplay.buzz/stream/s-2/${id.split('ep=').pop()}/${selectedServer.type}`;
    return { streamingLink: url, servers: selectedServer.name };
  }

  const streamingLink = await megacloud({ selectedServer, id });
  
  // Return direct CDN URLs - CDN blocks Cloudflare Workers but allows browser access
  // The M3U8 and TS segments can be fetched directly from the browser with CORS
  // Your frontend should use these URLs directly without proxying
  
  return streamingLink;
};
