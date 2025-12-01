import { axiosInstance } from '../services/axiosInstance.js';
import { validationError } from '../utils/errors.js';
import { extractWatch2gether } from '../extractor/extractWatch2gether.js';
import { withCache } from '../utils/redis.js';

const watch2getherController = async (c) => {
    const room = c.req.query('room') || '';

    return await withCache(
        `watch2gether-${room}`,
        async () => {
            console.log(`Fetching watch2gether rooms (${room || 'all'}) from external API...`);
            const endpoint = room ? `/watch2gether?room=${room}` : '/watch2gether';
            const result = await axiosInstance(endpoint);

            if (!result.success) {
                console.error('Watch2gether fetch failed:', result.message);
                throw new validationError(result.message);
            }

            return extractWatch2gether(result.data);
        },
        60 * 5 // 5 minutes cache
    );
};

export default watch2getherController;
