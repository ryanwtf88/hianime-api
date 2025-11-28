import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { rateLimiter } from 'hono-rate-limiter';
import { swaggerUI } from '@hono/swagger-ui';
import hiAnimeRoutes from './routes/routes.js';
import { AppError } from './utils/errors.js';
import { fail } from './utils/response.js';
import hianimeApiDocs from './utils/swaggerUi.js';
import { logger } from 'hono/logger';
import config from './config/config.js';

const app = new Hono();
const origins = config.origin.includes(',')
  ? config.origin.split(',').map(o => o.trim())
  : (config.origin === '*' ? '*' : [config.origin]);

app.use(
  '*',
  cors({
    origin: origins,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposeHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 600,
    credentials: true,
  })
);

if (config.rateLimit.enabled) {
  app.use(
    '*',
    rateLimiter({
      windowMs: config.rateLimit.windowMs,
      limit: config.rateLimit.limit,
      standardHeaders: 'draft-6',
      keyGenerator: (c) => {
        const vercelIp = c.req.header('x-vercel-forwarded-for');
        const cfConnectingIp = c.req.header('cf-connecting-ip');
        const realIp = c.req.header('x-real-ip');
        const forwarded = c.req.header('x-forwarded-for');

        return vercelIp || cfConnectingIp || realIp || forwarded?.split(',')[0].trim() || 'unknown';
      },
    })
  );
}

if (!config.isProduction || config.enableLogging) {
  app.use('/api/v1/*', logger());
}

app.get('/ui', (c) => {
  c.status(200);
  return c.json({
    message: 'Welcome to HiAnime API, crafted by RY4N',
    documentation: '/api/v1',
    swagger: '/',
    docs: '/docs',
    health: '/ping',
    version: '1.0.0',
    environment: config.isVercel ? 'vercel' : 'self-hosted',
    redis: config.redis.enabled ? 'enabled' : 'disabled',
  });
});

app.get('/ping', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.isVercel ? 'vercel' : 'self-hosted',
  });
});

app.route('/api/v1', hiAnimeRoutes);
app.get('/api', async (c) => {
  const html = await Bun.file('src/views/docs.html').text();
  return c.html(html);
});
app.get('/docs', (c) => c.json(hianimeApiDocs));
app.get('/', swaggerUI({ url: '/docs' }));
app.onError((err, c) => {
  if (err instanceof AppError) {
    return fail(c, err.message, err.statusCode, err.details);
  }

  console.error('Unexpected Error:', err.message);
  if (!config.isProduction) {
    console.error('Stack:', err.stack);
  }

  return fail(c, 'Internal server error', 500);
});

app.notFound((c) => {
  return fail(c, 'Route not found', 404);
});

export default app;