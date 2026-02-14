import { axiosInstance } from '../services/axiosInstance.js';
import { validationError } from '../utils/errors.js';
import { extractHomepage } from '../extractor/extractHomepage.js';
import { withCache } from '../utils/redis.js';

const homepageController = async () => {
  return await withCache(
    'home',
    async () => {
      console.log('Fetching homepage data from external API...');
      const result = await axiosInstance('/home');

      if (!result.success) {
        console.error('Homepage fetch failed:', result.message);
        throw new validationError(result.message);
      }

      return extractHomepage(result.data);
    },
    60 * 60 * 24 // 24 hours cache
  );
};

export default homepageController;
