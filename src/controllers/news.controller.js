import { axiosInstance } from '../services/axiosInstance.js';
import { validationError } from '../utils/errors.js';
import { extractNews } from '../extractor/extractNews.js';
import { withCache } from '../utils/redis.js';

const newsController = async (c) => {
  const page = c.req.query('page') || '1';

  return await withCache(
    `news-${page}`,
    async () => {
      console.log(`Fetching news page ${page} from external API...`);
      const endpoint = page === '1' ? '/news' : `/news?page=${page}`;
      const result = await axiosInstance(endpoint);

      if (!result.success) {
        console.error('News fetch failed:', result.message);
        throw new validationError(result.message);
      }

      return extractNews(result.data);
    },
    60 * 60 // 1 hour cache
  );
};

export default newsController;
