import { megacloud } from '../parsers/decryptor/megacloud.js';
import config from '../config/config.js';

export const extractStream = async ({ selectedServer, id }) => {
  if (selectedServer.name === 'HD-4') {
    const url = `https://megaplay.buzz/stream/s-2/${id.split('ep=').pop()}/${selectedServer.type}`;
    return { streamingLink: url, servers: selectedServer.name };
  }

  const streamingLink = await megacloud({ selectedServer, id });
  
  if (streamingLink && streamingLink.link && streamingLink.link.file) {
    const directUrl = streamingLink.link.file;
    const encodedUrl = encodeURIComponent(directUrl);
    const encodedReferer = encodeURIComponent('https://megacloud.tv');
    const proxiedUrl = `https://vercel-proxy-ryanwtf88.vercel.app/api/proxy?url=${encodedUrl}&referer=${encodedReferer}`;
    
    streamingLink.link.directUrl = directUrl;
    streamingLink.link.file = proxiedUrl;
    streamingLink.link.proxyUrl = proxiedUrl;
  }
  
  return streamingLink;
};
