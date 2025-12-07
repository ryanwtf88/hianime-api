import { megacloud } from '../parsers/decryptor/megacloud.js';
import config from '../config/config.js';

export const extractStream = async ({ selectedServer, id }) => {
  if (selectedServer.name === 'HD-4') {
    const url = `https://megaplay.buzz/stream/s-2/${id.split('ep=').pop()}/${selectedServer.type}`;
    return { streamingLink: url, servers: selectedServer.name };
  }

  const streamingLink = await megacloud({ selectedServer, id });
  
  // Use Vercel proxy for CORS support
  // CDN blocks Cloudflare Workers but allows Vercel
  // CDN doesn't have CORS headers, so we need proxy to add them
  
  if (streamingLink && streamingLink.link && streamingLink.link.file) {
    const directUrl = streamingLink.link.file;
    const encodedUrl = encodeURIComponent(directUrl);
    const encodedReferer = encodeURIComponent('https://megacloud.tv');
    
    // Use Vercel proxy endpoint (deployed separately)
    // Repository: https://github.com/ryanwtf88/vercel-proxy
    const proxiedUrl = `https://vercel-proxy-ryanwtf88.vercel.app/api/proxy?url=${encodedUrl}&referer=${encodedReferer}`;
    
    streamingLink.link.directUrl = directUrl; // Keep original
    streamingLink.link.file = proxiedUrl; // Primary URL is proxied through Vercel
    streamingLink.link.proxyUrl = proxiedUrl; // Same as file
  }
  
  return streamingLink;
};
