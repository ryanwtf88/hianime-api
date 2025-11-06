import axios from 'axios';
import config from '../../config/config.js';

const { baseurl } = config;

export async function filemoon({ selectedServer, id }) {
  try {
    const [{ data: sourcesData }] = await Promise.all([
      axios.get(`${baseurl}/ajax/v2/episode/sources?id=${selectedServer.id}`),
    ]);

    const ajaxLink = sourcesData?.link;
    if (!ajaxLink) throw new Error('Missing link in sourcesData');

    // Filemoon extraction
    const { data: html } = await axios.get(ajaxLink, {
      headers: {
        'User-Agent': config.headers['User-Agent'],
        Referer: baseurl,
      },
    });

    // Filemoon typically uses packed JavaScript
    let streamUrl = null;
    let tracks = [];

    // Method 1: Look for m3u8 in various formats
    const m3u8Patterns = [
      /file:\s*["']([^"']+\.m3u8[^"']*)["']/,
      /sources:\s*\[["']([^"']+\.m3u8[^"']*)["']\]/,
      /"file":\s*["']([^"']+\.m3u8[^"']*)["']/,
    ];

    for (const pattern of m3u8Patterns) {
      const match = html.match(pattern);
      if (match) {
        streamUrl = match[1];
        break;
      }
    }

    // Method 2: Try to find packed JavaScript and unpack
    if (!streamUrl) {
      const packedMatch = html.match(/eval\(function\(p,a,c,k,e,d\)([\s\S]+?)\)\)/);
      if (packedMatch) {
        try {
          // Simple unpacking for p,a,c,k,e,d format
          const packedCode = packedMatch[0];
          // This is a simplified approach - in production you'd want a proper unpacker
          const m3u8InPacked = packedCode.match(/['"](https?:\/\/[^'"]+\.m3u8[^'"]*)['"]/);
          if (m3u8InPacked) {
            streamUrl = m3u8InPacked[1];
          }
        } catch (e) {
          console.warn('Failed to unpack JavaScript:', e.message);
        }
      }
    }

    // Extract subtitles/tracks
    const tracksMatch = html.match(/tracks:\s*\[([\s\S]*?)\]/);
    if (tracksMatch) {
      try {
        const tracksStr = '[' + tracksMatch[1] + ']';
        tracks = eval(tracksStr);
      } catch (e) {
        console.warn('Failed to parse tracks:', e.message);
      }
    }

    if (!streamUrl) {
      throw new Error('Could not extract stream URL from Filemoon');
    }

    return {
      id,
      type: selectedServer.type,
      link: {
        file: streamUrl,
        type: 'hls',
      },
      tracks: tracks || [],
      intro: null,
      outro: null,
      server: selectedServer.name,
    };
  } catch (error) {
    console.error(`Error during filemoon(${id}):`, error.message);
    return null;
  }
}
