import axios from 'axios';
import CryptoJS from 'crypto-js';
import config from '../../config/config.js';
import extractToken from '../helper/token.helper.js';

const { baseurl } = config;

export async function megacloud({ selectedServer, id }) {
  const epID = id.split('ep=').pop();
  const fallback_1 = 'megaplay.buzz';
  const fallback_2 = 'vidwish.live';

  console.log('[megacloud] Starting extraction:', {
    id,
    epID,
    serverId: selectedServer.id,
    serverName: selectedServer.name,
    serverType: selectedServer.type,
  });

  try {
    console.log('[megacloud] Fetching sources and key...');
    const [{ data: sourcesData }, { data: key }] = await Promise.all([
      axios.get(`${baseurl}/ajax/v2/episode/sources?id=${selectedServer.id}`, {
        timeout: 10000,
        headers: {
          'User-Agent': config.headers['User-Agent'],
          'Referer': baseurl,
        },
      }),
      axios.get('https://raw.githubusercontent.com/itzzzme/megacloud-keys/refs/heads/main/key.txt', {
        timeout: 5000,
      }),
    ]);

    console.log('[megacloud] sourcesData:', sourcesData);
    console.log('[megacloud] key length:', key?.length);

    const ajaxLink = sourcesData?.link;
    if (!ajaxLink) {
      console.error('[megacloud] Missing link in sourcesData');
      throw new Error('Missing link in sourcesData');
    }

    const sourceIdMatch = /\/([^/?]+)\?/.exec(ajaxLink);
    const sourceId = sourceIdMatch?.[1];
    if (!sourceId) throw new Error('Unable to extract sourceId from link');

    const baseUrlMatch = ajaxLink.match(/^(https?:\/\/[^/]+(?:\/[^/]+){3})/);
    if (!baseUrlMatch) throw new Error('Could not extract base URL from ajaxLink');
    const baseUrl = baseUrlMatch[1];

    let decryptedSources = null;
    let rawSourceData = {};

    try {
      console.log('[megacloud] Extracting token from:', `${baseUrl}/${sourceId}`);
      const token = await extractToken(`${baseUrl}/${sourceId}?k=1&autoPlay=0&oa=0&asi=1`);
      
      if (!token) {
        throw new Error('Failed to extract token');
      }
      
      console.log('[megacloud] Token extracted, fetching sources...');
      const { data } = await axios.get(`${baseUrl}/getSources?id=${sourceId}&_k=${token}`, {
        timeout: 10000,
        headers: {
          'User-Agent': config.headers['User-Agent'],
          'Referer': `${baseUrl}/${sourceId}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      
      rawSourceData = data;
      console.log('[megacloud] Raw source data keys:', Object.keys(rawSourceData));
      
      const encrypted = rawSourceData?.sources;
      if (!encrypted) throw new Error('Encrypted source missing');

      console.log('[megacloud] Decrypting sources...');
      const decrypted = CryptoJS.AES.decrypt(encrypted, key.trim()).toString(CryptoJS.enc.Utf8);
      if (!decrypted) throw new Error('Failed to decrypt source');
      
      decryptedSources = JSON.parse(decrypted);
      console.log('[megacloud] Successfully decrypted sources');
    } catch (primaryError) {
      console.error('[megacloud] Primary extraction failed:', primaryError.message);
      try {
        const fallback = selectedServer.name.toLowerCase() === 'hd-1' ? fallback_1 : fallback_2;
        console.log('[megacloud] Trying fallback:', fallback);

        const { data: html } = await axios.get(
          `https://${fallback}/stream/s-2/${epID}/${selectedServer.type}`,
          {
            timeout: 10000,
            headers: {
              'User-Agent': config.headers['User-Agent'],
              'Referer': `https://${fallback_1}/`,
            },
          }
        );

        const dataIdMatch = html.match(/data-id=["'](\d+)["']/);
        const realId = dataIdMatch?.[1];
        if (!realId) throw new Error('Could not extract data-id for fallback');

        const { data: fallback_data } = await axios.get(
          `https://${fallback}/stream/getSources?id=${realId}`,
          {
            timeout: 10000,
            headers: {
              'User-Agent': config.headers['User-Agent'],
              'Referer': `https://${fallback}/`,
              'X-Requested-With': 'XMLHttpRequest',
            },
          }
        );

        console.log('[megacloud] Fallback data retrieved');
        decryptedSources = [{ file: fallback_data.sources.file }];
        if (!rawSourceData.tracks || rawSourceData.tracks.length === 0) {
          rawSourceData.tracks = fallback_data.tracks ?? [];
        }
        if (!rawSourceData.intro) {
          rawSourceData.intro = fallback_data.intro ?? null;
        }
        if (!rawSourceData.outro) {
          rawSourceData.outro = fallback_data.outro ?? null;
        }
      } catch (fallbackError) {
        console.error('[megacloud] Fallback extraction failed:', fallbackError.message);
        throw new Error('All extraction methods failed: ' + fallbackError.message);
      }
    }

    const streamFile = decryptedSources?.[0]?.file;
    
    if (!streamFile) {
      console.error('[megacloud] No stream file found in decrypted sources');
      throw new Error('No valid stream file found');
    }

    console.log('[megacloud] Successfully extracted stream file');

    return {
      id,
      type: selectedServer.type,
      link: {
        file: streamFile,
        type: 'hls',
      },
      tracks: rawSourceData.tracks ?? [],
      intro: rawSourceData.intro ?? null,
      outro: rawSourceData.outro ?? null,
      server: selectedServer.name,
    };
  } catch (error) {
    console.error('[megacloud] Critical error during extraction:', error.message);
    console.error('[megacloud] Error stack:', error.stack);
    return null;
  }
}
