import axios from 'axios';
import config from '../../config/config.js';

const { baseurl } = config;

export async function mp4upload({ selectedServer, id }) {
  try {
    const [{ data: sourcesData }] = await Promise.all([
      axios.get(`${baseurl}/ajax/v2/episode/sources?id=${selectedServer.id}`),
    ]);

    const ajaxLink = sourcesData?.link;
    if (!ajaxLink) throw new Error('Missing link in sourcesData');

    // MP4Upload extraction
    const { data: html } = await axios.get(ajaxLink, {
      headers: {
        'User-Agent': config.headers['User-Agent'],
        Referer: baseurl,
      },
    });

    let streamUrl = null;
    let tracks = [];

    // MP4Upload typically has the source in a player script
    const patterns = [
      /player\.src\(\s*["']([^"']+)["']\s*\)/,
      /src:\s*["']([^"']+\.(?:m3u8|mp4)[^"']*)["']/,
      /"src":\s*["']([^"']+\.(?:m3u8|mp4)[^"']*)["']/,
      /file:\s*["']([^"']+\.(?:m3u8|mp4)[^"']*)["']/,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        streamUrl = match[1];
        break;
      }
    }

    // Extract subtitles
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
      throw new Error('Could not extract stream URL from MP4Upload');
    }

    return {
      id,
      type: selectedServer.type,
      link: {
        file: streamUrl,
        type: streamUrl.includes('.m3u8') ? 'hls' : 'mp4',
      },
      tracks: tracks || [],
      intro: null,
      outro: null,
      server: selectedServer.name,
    };
  } catch (error) {
    console.error(`Error during mp4upload(${id}):`, error.message);
    return null;
  }
}
