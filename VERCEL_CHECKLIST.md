# Vercel Deployment Checklist ✅

Use this checklist to ensure your HiAnime API is properly configured for Vercel deployment.

## Pre-Deployment Checklist

### 1. Repository Setup
- [ ] Code is pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- [ ] Repository is accessible to Vercel
- [ ] All necessary files are committed (especially `api/index.js` and `vercel.json`)

### 2. Redis/Upstash Setup
- [ ] Created an Upstash account at [console.upstash.com](https://console.upstash.com)
- [ ] Created a Redis database
- [ ] Copied `UPSTASH_REDIS_REST_URL`
- [ ] Copied `UPSTASH_REDIS_REST_TOKEN`
- [ ] Verified Redis database is active

### 3. Vercel Account
- [ ] Created a Vercel account at [vercel.com](https://vercel.com)
- [ ] Connected Git provider (GitHub/GitLab/Bitbucket)

## Deployment Checklist

### 1. Import Project
- [ ] Clicked "New Project" in Vercel Dashboard
- [ ] Selected your repository
- [ ] Confirmed project settings

### 2. Environment Variables Configuration

Add these environment variables in Vercel Dashboard:

**Required:**
- [ ] `UPSTASH_REDIS_REST_URL` = Your Upstash Redis URL
- [ ] `UPSTASH_REDIS_REST_TOKEN` = Your Upstash Redis token

**Recommended:**
- [ ] `ORIGIN` = `*` (or your specific domain for production)
- [ ] `NODE_ENV` = `production`
- [ ] `RATE_LIMIT_ENABLED` = `true`
- [ ] `RATE_LIMIT_WINDOW_MS` = `60000`
- [ ] `RATE_LIMIT_LIMIT` = `100`

**Optional:**
- [ ] `ENABLE_LOGGING` = `false` (set to `true` for debugging)
- [ ] `BASE_URL` = (leave empty for auto-detection)

### 3. Deploy
- [ ] Clicked "Deploy"
- [ ] Wait for deployment to complete (usually 1-2 minutes)
- [ ] Deployment succeeded (green checkmark)

## Post-Deployment Verification

### 1. Test Basic Endpoints

Test these URLs (replace `your-deployment.vercel.app` with your actual Vercel URL):

- [ ] Root: `https://your-deployment.vercel.app/`
  - Should return JSON with welcome message
  
- [ ] Health check: `https://your-deployment.vercel.app/ping`
  - Should return `{"status": "ok", ...}`
  
- [ ] API docs: `https://your-deployment.vercel.app/api/v1`
  - Should return API documentation
  
- [ ] Swagger UI: `https://your-deployment.vercel.app/ui`
  - Should load Swagger documentation interface

### 2. Test API Functionality

- [ ] Home endpoint: `https://your-deployment.vercel.app/api/v1/home`
  - Should return anime home page data
  - First request might be slower (cache miss)
  - Second request should be faster (cache hit)

- [ ] Search endpoint: `https://your-deployment.vercel.app/api/v1/search?q=naruto`
  - Should return search results for "naruto"

### 3. Verify Redis Caching

Check Vercel Function Logs:
- [ ] First request shows "Cache MISS"
- [ ] Subsequent requests show "Cache HIT"
- [ ] Go to Upstash Console → Your Database → Metrics
- [ ] Verify commands are being executed

### 4. Check Response Headers

- [ ] CORS headers are present
- [ ] Rate limit headers are visible (if enabled)
- [ ] Response times are reasonable (< 5 seconds)

### 5. Monitor Logs

- [ ] Open Vercel Dashboard → Your Project → Functions
- [ ] Check for any error logs
- [ ] Verify successful requests

## Production Readiness Checklist

### 1. Security
- [ ] Changed `ORIGIN` from `*` to specific domain(s)
- [ ] Rate limiting is enabled and configured appropriately
- [ ] Redis credentials are stored as environment variables (not in code)
- [ ] No sensitive data in Git repository

### 2. Performance
- [ ] Redis caching is working properly
- [ ] Response times are acceptable
- [ ] Function memory is set appropriately (default: 1024MB)
- [ ] Function timeout is configured (default: 30s)

### 3. Monitoring
- [ ] Set up Vercel Analytics (optional but recommended)
- [ ] Configure error notifications
- [ ] Monitor Redis usage in Upstash Console
- [ ] Check function invocation counts

### 4. Custom Domain (Optional)
- [ ] Added custom domain in Vercel
- [ ] Updated DNS records
- [ ] SSL certificate is active
- [ ] Updated `ORIGIN` environment variable to include custom domain

### 5. Rate Limiting
- [ ] Rate limits are appropriate for your use case
- [ ] Tested rate limit behavior
- [ ] Documented rate limits for API users

## Troubleshooting

If you encounter issues, check:

- [ ] All environment variables are set correctly in Vercel
- [ ] Redis credentials are valid and database is active
- [ ] Function logs in Vercel Dashboard for error messages
- [ ] Upstash Redis dashboard for connection issues
- [ ] CORS settings if getting CORS errors in browser

## Common Issues and Solutions

### Issue: 500 Internal Server Error
✅ Solution:
1. Check Vercel Function Logs
2. Verify all environment variables are set
3. Test Redis connection in Upstash Console

### Issue: CORS Error
✅ Solution:
1. Set `ORIGIN=*` for testing
2. For production, set `ORIGIN=https://yourdomain.com`
3. Ensure protocol (http/https) matches

### Issue: Redis Connection Failed
✅ Solution:
1. Verify Redis credentials are correct
2. Check Upstash Redis dashboard
3. Ensure database is in active state

### Issue: Rate Limit Too Strict
✅ Solution:
1. Increase `RATE_LIMIT_LIMIT` value
2. Increase `RATE_LIMIT_WINDOW_MS` value
3. Or set `RATE_LIMIT_ENABLED=false` for testing

## Success Criteria

Your deployment is successful when:

- ✅ All test endpoints return expected data
- ✅ No errors in Vercel Function Logs
- ✅ Redis caching is working (cache hits visible in logs)
- ✅ Response times are reasonable
- ✅ Rate limiting works as expected
- ✅ CORS is properly configured

## Next Steps

After successful deployment:

1. 📝 Document your API URL
2. 🔗 Share API documentation with your team/users
3. 📊 Monitor usage and performance
4. 🔄 Set up automatic deployments (push to main → auto-deploy)
5. 🎨 Customize rate limits based on usage patterns
6. 🌐 Add custom domain (optional)
7. 📈 Consider upgrading Vercel/Upstash plans for higher traffic

## Support Resources

- 📚 [Vercel Documentation](https://vercel.com/docs)
- 📚 [Upstash Documentation](https://docs.upstash.com)
- 📚 [Hono Framework Documentation](https://hono.dev)
- 📝 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Detailed deployment guide
- 🐛 Report issues in your repository's Issues section

---

**Last Updated:** 2025-11-07

Keep this checklist handy for future deployments and updates! 🚀
