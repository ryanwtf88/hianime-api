import axios from 'axios';
import { validationError } from '../utils/errors.js';
import config from '../config/config.js';
import { extractSuggestions } from '../extractor/extractSuggestions.js';

const suggestionController = async (c) => {
  const keyword = c.req.query('keyword') || null;

  if (!keyword) throw new validationError('query is required');

  const noSpaceKeyword = keyword.trim().toLowerCase().replace(/\s+/g, '+');

  const endpoint = `/ajax/search/suggest?keyword=${noSpaceKeyword}`;
  const Referer = `${config.baseurl}/home`;
  const { data } = await axios.get(config.baseurl + endpoint, {
    headers: {
      Referer,
      ...config.headers,
    },
  });

  if (!data.status) throw new validationError('suggestion not found');

  const response = extractSuggestions(data.html);

  return response;
};

export default suggestionController;
