import { Redis } from '@upstash/redis';
import config from '../config/config.js';

const clearCache = async () => {
    const isRedisEnv = config.redis.enabled && config.redis.url && config.redis.token;

    if (!isRedisEnv) {
        return {
            success: false,
            message: 'Redis is not enabled or configured',
        };
    }

    const redis = new Redis({
        url: config.redis.url,
        token: config.redis.token,
    });

    const keys = await redis.keys('*');

    if (!keys || keys.length === 0) {
        return {
            success: true,
            message: 'No cache keys to clear',
            keysCleared: 0,
        };
    }

    await Promise.all(keys.map((k) => redis.del(k)));

    return {
        success: true,
        message: 'Cache cleared successfully',
        keysCleared: keys.length,
    };
};

export default clearCache;
