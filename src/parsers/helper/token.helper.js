import axios from 'axios';
import * as cheerio from 'cheerio';
import config from '../../config/config.js';

const { baseurl } = config;

const MAX_RETRIES = 3;
const TIMEOUT = 10000; // 10 seconds

/**
 * Extract token from megacloud/vidstream page
 * Tries multiple extraction methods with priority order
 */
export default async function extractToken(url, retryCount = 0) {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'Referer': `${baseurl}/`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: TIMEOUT,
    });

    const $ = cheerio.load(html);
    const results = {};
    const priorities = {}; // Track priority of each token

    // Method 1: Meta tag (highest priority)
    const meta = $('meta[name="_gg_fb"]').attr('content');
    if (meta && meta.length >= 10) {
      results.meta = meta;
      priorities.meta = 1;
    }

    // Method 2: Data attribute
    const dpi = $('[data-dpi]').attr('data-dpi');
    if (dpi && dpi.length >= 10) {
      results.dataDpi = dpi;
      priorities.dataDpi = 2;
    }

    // Method 3: Nonce script
    const nonceScript = $('script[nonce]')
      .filter((i, el) => {
        const text = $(el).text();
        return text.includes('empty nonce script') || text.includes('nonce');
      })
      .attr('nonce');
    if (nonceScript && nonceScript.length >= 10) {
      results.nonce = nonceScript;
      priorities.nonce = 3;
    }

    // Method 4: Window string assignments (improved regex)
    const stringAssignRegex = /window\.(\w+)\s*=\s*["']([a-zA-Z0-9_-]{10,})["']/g;
    const stringMatches = [...html.matchAll(stringAssignRegex)];
    for (const [, key, value] of stringMatches) {
      if (value.length >= 10) {
        const resultKey = `window.${key}`;
        results[resultKey] = value;
        priorities[resultKey] = 4;
      }
    }

    // Method 5: Window object assignments
    const objectAssignRegex = /window\.(\w+)\s*=\s*(\{[\s\S]*?\});/g;
    const matches = [...html.matchAll(objectAssignRegex)];
    for (const [, varName, rawObj] of matches) {
      try {
        // Safer evaluation using Function constructor
        const parsedObj = new Function('return ' + rawObj)();
        if (parsedObj && typeof parsedObj === 'object') {
          const stringValues = Object.values(parsedObj).filter(
            (val) => typeof val === 'string' && val.length >= 5
          );
          const concatenated = stringValues.join('');
          if (concatenated.length >= 20) {
            const resultKey = `window.${varName}`;
            results[resultKey] = concatenated;
            priorities[resultKey] = 5;
          }
        }
      } catch (err) {
        // Silently ignore parse errors
      }
    }

    // Method 6: HTML comments
    $('*')
      .contents()
      .each(function () {
        if (this.type === 'comment') {
          const commentText = this.data.trim();
          // Try multiple comment patterns
          const patterns = [
            /^_is_th:([a-zA-Z0-9_-]{10,})$/,
            /^token:([a-zA-Z0-9_-]{10,})$/,
            /^key:([a-zA-Z0-9_-]{10,})$/,
          ];

          for (const pattern of patterns) {
            const match = commentText.match(pattern);
            if (match) {
              results.commentToken = match[1].trim();
              priorities.commentToken = 6;
              break;
            }
          }
        }
      });

    // Select token based on priority (lower number = higher priority)
    if (Object.keys(results).length === 0) {
      throw new Error('No token found in page');
    }

    // Sort by priority and return the highest priority token
    const sortedResults = Object.entries(results).sort((a, b) => {
      return (priorities[a[0]] || 999) - (priorities[b[0]] || 999);
    });

    const token = sortedResults[0][1];

    if (!token || token.length < 10) {
      throw new Error('Invalid token length');
    }

    console.log(`Token extracted successfully (method: ${sortedResults[0][0]}, length: ${token.length})`);
    return token;

  } catch (err) {
    console.error(`Token extraction error (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err.message);

    // Retry logic
    if (retryCount < MAX_RETRIES - 1) {
      console.log(`Retrying token extraction... (${retryCount + 2}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
      return extractToken(url, retryCount + 1);
    }

    console.error('Token extraction failed after all retries');
    return null;
  }
}
