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

// Configure CORS with environment-based origins
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

// Apply rate limiting only if enabled
if (config.rateLimit.enabled) {
  app.use(
    '*',
    rateLimiter({
      windowMs: config.rateLimit.windowMs,
      limit: config.rateLimit.limit,
      standardHeaders: 'draft-6',
      keyGenerator: (c) => {
        // Vercel-specific headers
        const vercelIp = c.req.header('x-vercel-forwarded-for');
        const cfConnectingIp = c.req.header('cf-connecting-ip');
        const realIp = c.req.header('x-real-ip');
        const forwarded = c.req.header('x-forwarded-for');
        
        return vercelIp || cfConnectingIp || realIp || forwarded?.split(',')[0].trim() || 'unknown';
      },
    })
  );
}

// Logger for API routes (disabled in production for better performance)
if (!config.isProduction || process.env.ENABLE_LOGGING === 'true') {
  app.use('/api/v1/*', logger());
}

// Root route
app.get('/', (c) => {
  c.status(200);
  return c.json({
    message: 'Welcome to HiAnime API, crafted by RY4N',
    documentation: '/api/v1',
    swagger: '/ui',
    docs: '/docs',
    health: '/ping',
    version: '1.0.0',
    environment: config.isVercel ? 'vercel' : 'self-hosted',
    redis: config.redis.enabled ? 'enabled' : 'disabled',
  });
});

// Health check endpoint
app.get('/ping', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: config.isVercel ? 'vercel' : 'self-hosted',
  });
});

// API routes
app.route('/api/v1', hiAnimeRoutes);

// Documentation routes
app.get('/docs', (c) => c.json(hianimeApiDocs));
app.get('/ui', swaggerUI({ url: '/docs' }));

// Global error handler
app.onError((err, c) => {
  if (err instanceof AppError) {
    return fail(c, err.message, err.statusCode, err.details);
  }
  
  // Log unexpected errors
  console.error('Unexpected Error:', err.message);
  if (!config.isProduction) {
    console.error('Stack:', err.stack);
  }

  return fail(c, 'Internal server error', 500);
});

// 404 handler
app.notFound((c) => {
  return fail(c, 'Route not found', 404);
});

export default app;