import axios from 'axios';
import CryptoJS from 'crypto-js';
import config from '../config/config.js';
import extractToken from './token.helper.js';

// const { baseurl } = config;

const MAX_RETRIES = 2;
const TIMEOUT = 15000; // 15 seconds
let cachedKey = null;
let keyLastFetched = 0;
const KEY_CACHE_DURATION = 3600000; // 1 hour in milliseconds

/**
 * Fetch and cache the decryption key
 */
async function getDecryptionKey() {
  const now = Date.now();

  // Return cached key if still valid
  if (cachedKey && (now - keyLastFetched) < KEY_CACHE_DURATION) {
    console.log('Using cached decryption key');
    return cachedKey;
  }

  try {
    const { data: key } = await axios.get(
      'https://raw.githubusercontent.com/ryanwtf88/megacloud-keys/refs/heads/master/key.txt',
      { timeout: 5000 }
    );

    cachedKey = key.trim();
    keyLastFetched = now;
    console.log('Decryption key fetched and cached');
    return cachedKey;
  } catch (error) {
    console.error('Failed to fetch decryption key:', error.message);
    // Return cached key even if expired as fallback
    if (cachedKey) {
      console.log('Using expired cached key as fallback');
      return cachedKey;
    }
    throw new Error('Unable to fetch decryption key');
  }
}

/**
 * Attempt to decrypt sources using primary method
 */
async function decryptPrimarySource(baseUrl, sourceId, key) {
  try {
    const tokenUrl = `${baseUrl}/${sourceId}?k=1&autoPlay=0&oa=0&asi=1`;
    console.log('Extracting token from:', tokenUrl);

    const token = await extractToken(tokenUrl);
    if (!token) {
      throw new Error('Failed to extract token');
    }

    console.log('Fetching sources with token...');
    const { data } = await axios.get(
      `${baseUrl}/getSources?id=${sourceId}&_k=${token}`,
      {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': `${baseUrl}/${sourceId}`,
        },
        timeout: TIMEOUT,
      }
    );

    const encrypted = data?.sources;
    if (!encrypted) {
      throw new Error('Encrypted source missing from response');
    }

    let sources = null;
    if (typeof encrypted === 'string') {
      console.log('Decrypting sources...');
      console.log('Encrypted Start:', encrypted.substring(0, 50));
      let decrypted = '';
      try {
        // Try standard decryption first (passphrase)
        decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
      } catch {
        console.log('Standard decryption failed, trying Hex key...');
        try {
          decrypted = CryptoJS.AES.decrypt(encrypted, CryptoJS.enc.Hex.parse(key)).toString(CryptoJS.enc.Utf8);
        } catch {
          console.log('Hex decryption failed too.');
        }
      }

      if (!decrypted) {
        throw new Error('Decryption returned empty result');
      }
      sources = JSON.parse(decrypted);
    } else {
      console.log('Sources appear to be unencrypted (JSON object/array). using directly.');
      sources = encrypted;
    }

    return { sources, rawData: data };
  } catch (error) {
    console.error('Primary source decryption failed:', error.message);
    throw error;
  }
}



/**
 * Main megacloud decryption function
 */
export async function megacloud({ selectedServer, id }, retryCount = 0) {
  const epID = id.split('ep=').pop();

  try {
    console.log(`\n=== Megacloud Decryption Start (attempt ${retryCount + 1}/${MAX_RETRIES + 1}) ===`);
    console.log(`Episode ID: ${epID}, Server: ${selectedServer.name}, Type: ${selectedServer.type}`);

    const isAniwatch = selectedServer.source === 'aniwatchtv';
    const activeBaseUrl = isAniwatch ? config.baseurl2 : config.baseurl;

    // Fetch sources data and decryption key in parallel
    const [{ data: sourcesData }, key] = await Promise.all([
      axios.get(`${activeBaseUrl}/ajax/v2/episode/sources?id=${selectedServer.id}`, {
        timeout: TIMEOUT,
      }),
      getDecryptionKey(),
    ]);

    const ajaxLink = sourcesData?.link;
    if (!ajaxLink) {
      throw new Error('Missing link in sourcesData');
    }

    console.log('Ajax link:', ajaxLink);

    // Extract source ID from link
    const sourceIdMatch = /\/([^/?]+)\?/.exec(ajaxLink);
    const sourceId = sourceIdMatch?.[1];
    if (!sourceId) {
      throw new Error('Unable to extract sourceId from link');
    }

    // Extract base URL
    const baseUrlMatch = ajaxLink.match(/^(https?:\/\/[^/]+(?:\/[^/]+){3})/);
    if (!baseUrlMatch) {
      throw new Error('Could not extract base URL from ajaxLink');
    }
    const baseUrl = baseUrlMatch[1];

    console.log(`Base URL: ${baseUrl}, Source ID: ${sourceId}`);

    let decryptedSources = null;
    let rawSourceData = {};

    // Try primary decryption method
    const decryptResult = await decryptPrimarySource(baseUrl, sourceId, key);
    decryptedSources = decryptResult.sources;
    rawSourceData = decryptResult.rawData;
    console.log('Primary decryption successful');

    // Validate we have sources
    if (!decryptedSources || !decryptedSources[0]?.file) {
      throw new Error('No valid source file found in decrypted data');
    }

    const result = {
      id,
      type: selectedServer.type,
      link: {
        file: decryptedSources[0].file,
        type: 'hls',
      },
      tracks: rawSourceData.tracks ?? [],
      intro: rawSourceData.intro ?? null,
      outro: rawSourceData.outro ?? null,
      server: selectedServer.name,
    };

    console.log('=== Megacloud Decryption Success ===\n');
    return result;

  } catch (error) {
    console.error(`Megacloud decryption error (attempt ${retryCount + 1}):`, error.message);

    // Retry logic
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying... (${retryCount + 2}/${MAX_RETRIES + 1})`);
      await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
      return megacloud({ selectedServer, id }, retryCount + 1);
    }

    console.error('=== Megacloud Decryption Failed ===\n');
    return null;
  }
}
