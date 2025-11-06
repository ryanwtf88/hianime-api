import config from '../config/config.js';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay
const TIMEOUT = 10000; // 10 seconds

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const axiosInstance = async (endpoint, retries = MAX_RETRIES) => {
  const url = config.baseurl + endpoint;
  let lastError = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (attempt > 0) {
        // Exponential backoff: wait longer with each retry
        const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
        console.log(`Retry attempt ${attempt + 1}/${retries} after ${delay}ms delay...`);
        await sleep(delay);
      }

      console.log(`Fetching (attempt ${attempt + 1}/${retries}): ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
      
      const response = await fetch(url, {
        headers: {
          ...(config.headers || {}),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Cache-Control': 'max-age=0',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log(`Response status: ${response.status}`);
      
      // Handle rate limiting with retry
      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : RETRY_DELAY * 2;
        console.warn(`Rate limited. Waiting ${waitTime}ms before retry...`);
        await sleep(waitTime);
        continue;
      }

      // Handle server errors with retry
      if (response.status >= 500 && response.status < 600) {
        throw new Error(`Server error: HTTP ${response.status}`);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.text();
      
      if (!data || data.length === 0) {
        throw new Error('Empty response received');
      }
      
      console.log(`Success: Received data length: ${data.length}`);
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      lastError = error;
      console.error(`Fetch error (attempt ${attempt + 1}/${retries}) for ${endpoint}:`, error.message);
      
      if (error.name === 'AbortError') {
        lastError = new Error('Request timeout - the external API took too long to respond');
      }

      // Don't retry on certain errors
      if (error.message.includes('HTTP 40') && !error.message.includes('429')) {
        // Client errors (except 429) should not be retried
        break;
      }

      // If this is the last attempt, we'll return the error
      if (attempt === retries - 1) {
        break;
      }
    }
  }
  
  return {
    success: false,
    message: lastError?.message || 'Unknown error occurred',
  };
};
