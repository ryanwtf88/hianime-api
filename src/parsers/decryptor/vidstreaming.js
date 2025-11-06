import axios from 'axios';
import config from '../../config/config.js';

const { baseurl } = config;

export async function vidstreaming({ selectedServer, id }) {
  try {
    const [{ data: sourcesData }] = await Promise.all([
      axios.get(`${baseurl}/ajax/v2/episode/sources?id=${selectedServer.id}`),
    ]);

    const ajaxLink = sourcesData?.link;
    if (!ajaxLink) throw new Error('Missing link in sourcesData');

    // VidStreaming extraction
    const sourceIdMatch = /\/([^/?]+)\?/.exec(ajaxLink);
    const sourceId = sourceIdMatch?.[1];
    if (!sourceId) throw new Error('Unable to extract sourceId from link');

    // Try to get direct source
    const { data: html } = await axios.get(ajaxLink, {
      headers: {
        'User-Agent': config.headers['User-Agent'],
        Referer: baseurl,
      },
    });

    // Extract sources from various possible formats
    let streamUrl = null;
    let tracks = [];

    // Method 1: Look for m3u8 in file: property
    const m3u8Match = html.match(/file:\s*["']([^"']+\.m3u8[^"']*)["']/);
    if (m3u8Match) {
      streamUrl = m3u8Match[1];
    }

    // Method 2: Look for sources array
    if (!streamUrl) {
      const sourcesMatch = html.match(/sources:\s*\[([\s\S]*?)\]/);
      if (sourcesMatch) {
        try {
          const sourcesStr = '[' + sourcesMatch[1] + ']';
          const sources = eval(sourcesStr);
          if (sources && sources.length > 0) {
            streamUrl = sources[0].file || sources[0].src;
          }
        } catch (e) {
          console.warn('Failed to parse sources:', e.message);
        }
      }
    }

    // Extract tracks/subtitles
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
      throw new Error('Could not extract stream URL from VidStreaming');
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
    console.error(`Error during vidstreaming(${id}):`, error.message);
    return null;
  }
}
