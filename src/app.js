import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { rateLimiter } from 'hono-rate-limiter';
import { swaggerUI } from '@hono/swagger-ui';
import hiAnimeRoutes from './routes/routes.js';
import { AppError } from './utils/errors.js';
import { fail } from './utils/response.js';
import hianimeApiDocs from './utils/swaggerUi.js';
import { logger } from 'hono/logger';

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
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 60000,
    limit: process.env.RATE_LIMIT_LIMIT || 100,
    standardHeaders: 'draft-6',
    keyGenerator: () => '<unique_key>',
  })
);

app.use('/api/v1/*', logger());

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
    return fail(c, err.message, err.statusCode, err.details);
  }
  console.error('unexpacted Error :' + err.message);

  return fail(c);
});

export default app;
