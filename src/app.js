import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { rateLimiter } from 'hono-rate-limiter';
import { swaggerUI } from '@hono/swagger-ui';
import { logger as honoLogger } from 'hono/logger';
import hiAnimeRoutes from './routes/routes.js';
import { AppError } from './utils/errors.js';
import { fail } from './utils/response.js';
import hianimeApiDocs from './utils/swaggerUi.js';
import logger from './utils/logger.js';
import config from './config/config.js';

const app = new Hono();
const origins = process.env.ORIGIN ? process.env.ORIGIN.split(',') : '*';

app.use(
  '*',
  cors({
    origin: origins,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: '*',
  })
);

app.use(
  rateLimiter({
    windowMs: config.rateLimit.windowMs,
    limit: config.rateLimit.limit,
    standardHeaders: 'draft-6',
    keyGenerator: (c) => {
      // Get client IP from various possible headers (prioritized)
      const cfConnectingIp = c.req.header('cf-connecting-ip');
      const realIp = c.req.header('x-real-ip');
      const forwarded = c.req.header('x-forwarded-for');
      
      return cfConnectingIp || realIp || forwarded?.split(',')[0].trim() || 'unknown';
    },
  })
);

app.use('/api/v1/*', honoLogger());

app.get('/', (c) => {
  c.status(200);
  return c.text('Welcome To hianime-api, Crafted By RY4N, open /api/v1 for documentation');
});
app.get('/ping', (c) => {
  return c.text('pong');
});
app.route('/api/v1', hiAnimeRoutes);
app.get('/docs', (c) => c.json(hianimeApiDocs));
app.get('/ui', swaggerUI({ url: '/docs' }));
app.onError((err, c) => {
  if (err instanceof AppError) {
    logger.warn('Application error', {
      message: err.message,
      statusCode: err.statusCode,
      details: err.details,
      path: c.req.path,
    });
    return fail(c, err.message, err.statusCode, err.details);
  }
  
  logger.error('Unexpected error', {
    message: err.message,
    stack: err.stack,
    path: c.req.path,
  });

  return fail(c);
});

export default app;
