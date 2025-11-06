import axios from 'axios';
import config from '../../config/config.js';

const { baseurl } = config;

export async function streamwish({ selectedServer, id }) {
  const epID = id.split('ep=').pop();

  try {
    const [{ data: sourcesData }] = await Promise.all([
      axios.get(`${baseurl}/ajax/v2/episode/sources?id=${selectedServer.id}`),
    ]);

    const ajaxLink = sourcesData?.link;
    if (!ajaxLink) throw new Error('Missing link in sourcesData');

    // StreamWish direct link extraction
    const { data: html } = await axios.get(ajaxLink, {
      headers: {
        'User-Agent': config.headers['User-Agent'],
        Referer: baseurl,
      },
    });

    // Extract m3u8 link from StreamWish page
    const m3u8Match = html.match(/file:\s*"([^"]+\.m3u8[^"]*)"/);
    const streamUrl = m3u8Match?.[1];

    if (!streamUrl) {
      throw new Error('Could not extract stream URL from StreamWish');
    }

    // Extract subtitles if available
    const tracksRegex = /tracks:\s*\[([\s\S]*?)\]/;
    const tracksMatch = html.match(tracksRegex);
    let tracks = [];

    if (tracksMatch) {
      try {
        const tracksStr = '[' + tracksMatch[1] + ']';
        tracks = eval(tracksStr);
      } catch (e) {
        console.warn('Failed to parse tracks:', e.message);
      }
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
    console.error(`Error during streamwish(${id}):`, error.message);
    return null;
  }
}
