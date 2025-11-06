import { megacloud } from '../parsers/decryptor/megacloud.js';
import { streamwish } from '../parsers/decryptor/streamwish.js';
import { vidstreaming } from '../parsers/decryptor/vidstreaming.js';
import { filemoon } from '../parsers/decryptor/filemoon.js';
import { mp4upload } from '../parsers/decryptor/mp4upload.js';

export const extractStream = async ({ selectedServer, id }) => {
  const serverName = selectedServer.name.toUpperCase();
  
  // HD-4 direct link
  if (serverName === 'HD-4') {
    const url = `https://megaplay.buzz/stream/s-2/${id.split('ep=').pop()}/${selectedServer.type}`;
    return { 
      id,
      type: selectedServer.type,
      link: {
        file: url,
        type: 'direct',
      },
      tracks: [],
      intro: null,
      outro: null,
      server: selectedServer.name,
    };
  }

  // Server detection and routing with fallback
  let result = null;
  
  try {
    // Primary: Try specific server based on name
    if (serverName.includes('STREAMWISH') || serverName.includes('WISH')) {
      result = await streamwish({ selectedServer, id });
    } else if (serverName.includes('VIDSTREAMING') || serverName.includes('VIDHIDE')) {
      result = await vidstreaming({ selectedServer, id });
    } else if (serverName.includes('FILEMOON') || serverName.includes('MOON')) {
      result = await filemoon({ selectedServer, id });
    } else if (serverName.includes('MP4UPLOAD') || serverName.includes('UPLOAD')) {
      result = await mp4upload({ selectedServer, id });
    } else {
      // Default to megacloud for HD-1, HD-2, and unknown servers
      result = await megacloud({ selectedServer, id });
    }

    // If primary method failed, try fallback servers
    if (!result || !result.link?.file) {
      console.log(`Primary extraction failed for ${serverName}, trying fallback...`);
      
      // Try megacloud as fallback
      if (serverName !== 'HD-1' && serverName !== 'HD-2') {
        result = await megacloud({ selectedServer, id });
      }
      
      // If still no result, try streamwish as secondary fallback
      if (!result || !result.link?.file) {
        result = await streamwish({ selectedServer, id });
      }
      
      // Last resort: vidstreaming
      if (!result || !result.link?.file) {
        result = await vidstreaming({ selectedServer, id });
      }
    }

    return result || {
      id,
      type: selectedServer.type,
      link: {
        file: null,
        type: 'hls',
      },
      tracks: [],
      intro: null,
      outro: null,
      server: selectedServer.name,
      error: 'All extraction methods failed',
    };
  } catch (error) {
    console.error(`Error in extractStream for ${serverName}:`, error.message);
    
    return {
      id,
      type: selectedServer.type,
      link: {
        file: null,
        type: 'hls',
      },
      tracks: [],
      intro: null,
      outro: null,
      server: selectedServer.name,
      error: error.message,
    };
  }
};
