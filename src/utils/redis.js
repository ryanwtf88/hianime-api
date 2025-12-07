import { Redis } from '@upstash/redis';
import config from '../config/config.js';

let redisClient = null;

/**
 * Get or create Redis client instance
 * @returns {Redis|null} Redis client or null if not configured
 */
export const getRedisClient = () => {
  if (!config.redis.enabled) {
    return null;
  }

  if (!redisClient) {
    try {
      redisClient = new Redis({
        url: config.redis.url,
        token: config.redis.token,
        automaticDeserialization: false,
      });
      console.log('Redis client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Redis client:', error.message);
      return null;
    }
  }

  return redisClient;
};

/**
 * Get cached data from Redis
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} Cached data or null if not found
 */
export const getCachedData = async (key) => {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const data = await redis.get(key);
    if (data) {
      console.log(`Cache HIT: ${key}`);
      return typeof data === 'string' ? JSON.parse(data) : data;
    }
    console.log(`Cache MISS: ${key}`);
    return null;
  } catch (error) {
    console.error(`Redis GET error for key "${key}":`, error.message);
    return null;
  }
};

/**
 * Set cached data in Redis
 * @param {string} key - Cache key
 * @param {any} value - Data to cache
 * @param {number} ttl - Time to live in seconds (default: 24 hours)
 * @returns {Promise<boolean>} Success status
 */
export const setCachedData = async (key, value, ttl = 60 * 60 * 24) => {
  const redis = getRedisClient();
  if (!redis) return false;

  try {
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    await redis.set(key, serializedValue, { ex: ttl });
    console.log(`Cache SET: ${key} (TTL: ${ttl}s)`);
    return true;
  } catch (error) {
    console.error(`Redis SET error for key "${key}":`, error.message);
    return false;
  }
};

/**
 * Delete cached data from Redis
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} Success status
 */
export const deleteCachedData = async (key) => {
  const redis = getRedisClient();
  if (!redis) return false;

  try {
    await redis.del(key);
    console.log(`Cache DELETE: ${key}`);
    return true;
  } catch (error) {
    console.error(`Redis DELETE error for key "${key}":`, error.message);
    return false;
  }
};

/**
 * Clear all cached data from Redis
 * @returns {Promise<boolean>} Success status
 */
export const clearAllCache = async () => {
  const redis = getRedisClient();
  if (!redis) return false;

  try {
    // Get all keys
    const keys = await redis.keys('*');
    if (keys && keys.length > 0) {
      // Delete all keys
      await redis.del(...keys);
      console.log(`Cache CLEAR ALL: Deleted ${keys.length} keys`);
      return true;
    }
    console.log('Cache CLEAR ALL: No keys to delete');
    return true;
  } catch (error) {
    console.error('Redis CLEAR ALL error:', error.message);
    return false;
  }
};

/**
 * Check if Redis is available and enabled
 * @returns {boolean}
 */
export const isRedisEnabled = () => {
  return config.redis.enabled;
};

/**
 * Cache wrapper function for controllers
 * @param {string} key - Cache key
 * @param {Function} fetchFunction - Function to fetch fresh data
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<any>} Cached or fresh data
 */
export const withCache = async (key, fetchFunction, ttl = 60 * 60 * 24) => {
  // Try to get from cache first
  const cachedData = await getCachedData(key);
  if (cachedData) {
    return cachedData;
  }

  // Fetch fresh data
  const freshData = await fetchFunction();

  // Cache the fresh data
  await setCachedData(key, freshData, ttl);

  return freshData;
};

export default {
  getRedisClient,
  getCachedData,
  setCachedData,
  deleteCachedData,
  clearAllCache,
  isRedisEnabled,
  withCache,
};
