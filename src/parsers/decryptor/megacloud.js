import axios from 'axios';
import CryptoJS from 'crypto-js';
import config from '../../config/config.js';
import extractToken from '../helper/token.helper.js';

const { baseurl } = config;

export async function megacloud({ selectedServer, id }) {
  const epID = id.split('ep=').pop();
  const fallback_1 = 'megaplay.buzz';
  const fallback_2 = 'vidwish.live';

  try {
    // Fetch sources and decryption key with timeout
    const promises = [
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
    ];

    const [{ data: sourcesData }, { data: key }] = await Promise.all(promises);

    const ajaxLink = sourcesData?.link;
    if (!ajaxLink) throw new Error('Missing link in sourcesData');

    const sourceIdMatch = /\/([^/?]+)\?/.exec(ajaxLink);
    const sourceId = sourceIdMatch?.[1];
    if (!sourceId) throw new Error('Unable to extract sourceId from link');

    const baseUrlMatch = ajaxLink.match(/^(https?:\/\/[^/]+(?:\/[^/]+){3})/);
    if (!baseUrlMatch) throw new Error('Could not extract base URL from ajaxLink');
    const baseUrl = baseUrlMatch[1];

    let decryptedSources = null;
    let rawSourceData = {};

    try {
      // throw new Error('skip for now');
      const token = await extractToken(`${baseUrl}/${sourceId}?k=1&autoPlay=0&oa=0&asi=1`);
      
      if (!token) {
        throw new Error('Failed to extract token');
      }

      const { data } = await axios.get(`${baseUrl}/getSources?id=${sourceId}&_k=${token}`, {
        timeout: 10000,
        headers: {
          'User-Agent': config.headers['User-Agent'],
          'Referer': `${baseUrl}/${sourceId}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      
      rawSourceData = data;
      const encrypted = rawSourceData?.sources;
      if (!encrypted) throw new Error('Encrypted source missing');

      const decrypted = CryptoJS.AES.decrypt(encrypted, key.trim()).toString(CryptoJS.enc.Utf8);
      if (!decrypted) throw new Error('Failed to decrypt source');
      
      decryptedSources = JSON.parse(decrypted);
      
      if (!decryptedSources || decryptedSources.length === 0) {
        throw new Error('No sources found after decryption');
      }
    } catch (primaryError) {
      console.warn(`Primary extraction failed: ${primaryError.message}`);
      try {
        const fallback = selectedServer.name.toLowerCase() === 'hd-1' ? fallback_1 : fallback_2;

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

        if (!fallback_data?.sources?.file) {
          throw new Error('Invalid fallback data structure');
        }

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
        console.error('Fallback extraction failed:', fallbackError.message);
        throw new Error('All extraction methods failed: ' + fallbackError.message);
      }
    }

    const streamFile = decryptedSources?.[0]?.file;
    
    if (!streamFile) {
      throw new Error('No valid stream file found after all attempts');
    }

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
    console.error(`Error during megacloud extraction(${id}):`, error.message);
    return null;
  }
}
