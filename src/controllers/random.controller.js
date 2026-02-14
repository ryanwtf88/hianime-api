import { axiosInstance } from '../services/axiosInstance.js';
import { validationError } from '../utils/errors.js';
import * as cheerio from 'cheerio';

const randomController = async () => {
  console.log('Fetching random anime...');
  const result = await axiosInstance('/home');

  if (!result.success) {
    console.error('Random anime fetch failed:', result.message);
    throw new validationError(result.message);
  }

  const $ = cheerio.load(result.data);

  const animes = [];
  $('.flw-item').each((i, el) => {
    const link = $(el).find('.film-name .dynamic-name').attr('href');
    const id = link?.split('/').pop();
    if (id) animes.push(id);
  });

  if (animes.length === 0) {
    throw new validationError('No anime found');
  }

  const randomId = animes[Math.floor(Math.random() * animes.length)];

  return { id: randomId };
};

export default randomController;
