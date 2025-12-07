import { megacloud } from '../parsers/decryptor/megacloud.js';
import config from '../config/config.js';

export const extractStream = async ({ selectedServer, id }) => {
  if (selectedServer.name === 'HD-4') {
    const url = `https://megaplay.buzz/stream/s-2/${id.split('ep=').pop()}/${selectedServer.type}`;
    return { streamingLink: url, servers: selectedServer.name };
  }

  const streamingLink = await megacloud({ selectedServer, id });
  
  // Return direct CDN URLs for browser to fetch
  // CDN has CORS enabled and allows direct browser access
  // CDN blocks Cloudflare Workers IPs, so proxy won't work
  
  // Add both direct and proxied URLs for frontend compatibility
  if (streamingLink && streamingLink.link && streamingLink.link.file) {
    const directUrl = streamingLink.link.file;
    
    // Store both URLs
    streamingLink.link.directUrl = directUrl;
    streamingLink.link.file = directUrl; // Primary URL is direct
    
    // Optional: Add proxy endpoint URL for frontend that expects it
    // But note: This will redirect back to direct URL
    const encodedUrl = encodeURIComponent(directUrl);
    streamingLink.link.proxyUrl = `${config.baseUrl}/api/v1/embed/proxy?url=${encodedUrl}`;
  }
  
  return streamingLink;
};
