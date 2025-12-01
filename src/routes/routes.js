import { Hono } from 'hono';
import documentationController from '../controllers/documentation.controller.js';
import handler from '../utils/handler.js';

import homepageController from '../controllers/homepage.controller.js';
import detailpageController from '../controllers/detailpage.controller.js';
import listpageController from '../controllers/listpage.controller.js';
import searchController from '../controllers/search.controller.js';
import suggestionController from '../controllers/suggestion.controller.js';
import charactersController from '../controllers/characters.controller.js';
import characterDetailConroller from '../controllers/characterDetail.controller.js';
import episodesController from '../controllers/episodes.controller.js';
import serversController from '../controllers/serversController.js';
import streamController from '../controllers/streamController.js';
import allGenresController from '../controllers/allGenres.controller.js';
import nextEpisodeScheduleController from '../controllers/nextEpisodeSchedule.controller.js';
import filterController from '../controllers/filter.controller.js';
import filterOptions from '../utils/filter.js';
import clearCacheController from '../controllers/clearCache.controller.js';
import newsController from '../controllers/news.controller.js';
import watch2getherController from '../controllers/watch2gether.controller.js';
import randomController from '../controllers/random.controller.js';

import schedulesController from '../controllers/schedules.controller.js';

const router = new Hono();

router.get('/', handler(documentationController));
router.get('/home', handler(homepageController));
router.get('/schedules', handler(schedulesController));
router.get('/schedule/next/:id', handler(nextEpisodeScheduleController));
router.get('/anime/:id', handler(detailpageController));
router.get('/animes/:query/:category?', handler(listpageController));
router.get('/search', handler(searchController));
router.get(
  '/filter/options',
  handler(() => filterOptions)
);
router.get('/filter', handler(filterController));
router.get('/suggestion', handler(suggestionController));
router.get('/characters/:id', handler(charactersController));
router.get('/character/:id', handler(characterDetailConroller));
router.get('/episodes/:id', handler(episodesController));
router.get('/servers', handler(serversController));
router.get('/stream', handler(streamController));
router.get('/genres', handler(allGenresController));
router.get('/news', handler(newsController));
router.get('/watch2gether', handler(watch2getherController));
router.get('/random', handler(randomController));
router.get('/admin/clear-cache', handler(clearCacheController));

export default router;
