import axios from 'axios';
import { validationError } from '../utils/errors.js';
import { extractWatch2gether } from '../extractor/extractWatch2gether.js';
import { withCache } from '../utils/redis.js';
import config from '../config/config.js';

const VALID_ROOM_FILTERS = ['all', 'on_air', 'scheduled', 'waiting', 'ended'];

const watch2getherController = async (c) => {
    const room = c.req.query('room') || 'all';

    // Validate room parameter
    if (!VALID_ROOM_FILTERS.includes(room)) {
        throw new validationError(
            `Invalid room filter. Must be one of: ${VALID_ROOM_FILTERS.join(', ')}`
        );
    }

    return await withCache(
        `watch2gether-${room}`,
        async () => {
            console.log(`Fetching watch2gether rooms (${room}) from AJAX API...`);

            try {
                const response = await axios.get(`${config.baseurl}/ajax/watch2gether/list`, {
                    params: { room },
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Referer': `${config.baseurl}/watch2gether`,
                    },
                });

                if (!response.data || !response.data.status) {
                    throw new validationError('Failed to fetch watch2gether data');
                }

                return extractWatch2gether(response.data.html);
            } catch (error) {
                console.error('Watch2gether fetch failed:', error.message);
                throw new validationError(error.message);
            }
        },
        60 * 5 // 5 minutes cache
    );
};

export default watch2getherController;
