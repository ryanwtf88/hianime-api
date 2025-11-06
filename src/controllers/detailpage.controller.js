import { extractDetailpage } from '../extractor/extractDetailpage.js';
import { axiosInstance } from '../services/axiosInstance.js';
import { validationError } from '../utils/errors.js';

const detailpageController = async (c) => {
  const id = c.req.param('id');
  const result = await axiosInstance(`/${id}`);
  if (!result.success) {
    throw new validationError(result.message, 'maybe id is incorrect : ' + id);
  }
  const response = extractDetailpage(result.data);

  return response;
};

export default detailpageController;
