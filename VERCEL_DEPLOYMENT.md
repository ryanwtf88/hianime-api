# Vercel Deployment Guide for HiAnime API

This guide will help you deploy the HiAnime API to Vercel as a serverless application.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Upstash Redis account (sign up at [upstash.com](https://upstash.com))
3. Git repository with your code

## Step 1: Set Up Upstash Redis

Redis caching is **required** for optimal performance on Vercel's serverless environment.

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database:
   - Click "Create Database"
   - Choose a name for your database
   - Select a region close to your Vercel deployment region
   - Choose the free tier or paid plan based on your needs
3. Copy the following credentials:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Configure your project:
   - **Framework Preset**: Other
   - **Build Command**: Leave empty (not needed)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. Add Environment Variables (click "Environment Variables"):

```env
# Required
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token-here

# Optional
ORIGIN=*
BASE_URL=
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_LIMIT=100
NODE_ENV=production
```

6. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Set up environment variables:
```bash
vercel env add UPSTASH_REDIS_REST_URL
vercel env add UPSTASH_REDIS_REST_TOKEN
```

4. Deploy:
```bash
vercel --prod
```

## Step 3: Configure Environment Variables

After deployment, you can add or update environment variables:

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Add/Update the following variables:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL | `https://your-instance.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST Token | `AXaEAAIc...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ORIGIN` | CORS allowed origins (comma-separated) | `*` |
| `BASE_URL` | Your API base URL | Auto-detected |
| `RATE_LIMIT_ENABLED` | Enable rate limiting | `true` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | `60000` (1 min) |
| `RATE_LIMIT_LIMIT` | Max requests per window | `100` |
| `NODE_ENV` | Environment | `production` |
| `ENABLE_LOGGING` | Enable detailed logs | `false` |

## Step 4: Verify Deployment

After deployment, test your API:

1. **Health Check**:
   ```bash
   curl https://your-deployment.vercel.app/ping
   ```

2. **Root Endpoint**:
   ```bash
   curl https://your-deployment.vercel.app/
   ```

3. **API Documentation**:
   - Open: `https://your-deployment.vercel.app/api/v1`
   - Swagger UI: `https://your-deployment.vercel.app/ui`

4. **Test an Endpoint**:
   ```bash
   curl https://your-deployment.vercel.app/api/v1/home
   ```

## Step 5: Configure CORS (Optional)

If you need to restrict CORS to specific domains:

1. Set the `ORIGIN` environment variable in Vercel:
   ```
   ORIGIN=https://yourdomain.com,https://www.yourdomain.com
   ```

2. Redeploy your application

## Troubleshooting

### Issue: "Internal Server Error"
- **Solution**: Check Vercel logs in the dashboard under "Functions" tab
- Verify all environment variables are set correctly
- Ensure Upstash Redis credentials are valid

### Issue: "Rate Limit Exceeded"
- **Solution**: Adjust rate limit settings:
  ```env
  RATE_LIMIT_WINDOW_MS=120000  # 2 minutes
  RATE_LIMIT_LIMIT=200         # 200 requests
  ```

### Issue: "Redis Connection Failed"
- **Solution**: 
  - Verify Redis credentials are correct
  - Check Upstash Redis dashboard for any issues
  - Ensure your Redis database is in an active state

### Issue: "Function Timeout"
- **Solution**: This is rare, but if it happens:
  - The default timeout is 30 seconds (configured in `vercel.json`)
  - Upgrade to Vercel Pro for longer timeout limits

### Issue: "CORS Errors"
- **Solution**: 
  - Set `ORIGIN=*` for development
  - Set specific domains for production: `ORIGIN=https://yourdomain.com`
  - Check browser console for specific CORS error messages

## Performance Optimization

1. **Redis Caching**: Enabled by default when Redis credentials are provided
2. **Rate Limiting**: Protects your API from abuse
3. **Region Selection**: Deploy to regions close to your users
4. **Function Memory**: Default is 1024MB (configured in `vercel.json`)

## Monitoring

1. **View Logs**: Vercel Dashboard → Your Project → Functions
2. **Analytics**: Vercel Dashboard → Your Project → Analytics
3. **Redis Metrics**: Upstash Console → Your Database → Metrics

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `ORIGIN` environment variable if needed

## Continuous Deployment

Vercel automatically deploys when you push to your Git repository:
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment

## Cost Considerations

- **Vercel Free Tier**: 
  - 100GB bandwidth/month
  - 100 hours serverless function execution/month
  - Unlimited deployments
  
- **Upstash Free Tier**:
  - 10,000 commands/day
  - 256MB storage

For high-traffic applications, consider upgrading to paid plans.

## Support

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Upstash Documentation: [docs.upstash.com](https://docs.upstash.com)
- HiAnime API Issues: Check your repository's issues page

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure environment variables
3. ✅ Set up custom domain (optional)
4. ✅ Configure CORS for your frontend
5. ✅ Monitor logs and analytics
6. ✅ Set up alerts for errors (Vercel integrations)

---

**Note**: Make sure to keep your Redis credentials secure and never commit them to your repository!
