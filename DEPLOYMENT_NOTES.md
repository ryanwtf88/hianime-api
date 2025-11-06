# Deployment Notes - Version 2.0.0

## Quick Start

Your codebase has been comprehensively improved! Here's what you need to know:

## ✅ What Changed

### 1. **Fixed Bugs**
- ✅ Rate limiter now works correctly (uses actual client IP)
- ✅ Fixed typos in error messages
- ✅ Improved error handling throughout

### 2. **Added 4 New Streaming Servers**
Your API now supports:
- **Megacloud** (existing, improved)
- **StreamWish** (NEW)
- **VidStreaming** (NEW)
- **Filemoon** (NEW)
- **MP4Upload** (NEW)

Each server has:
- Multiple extraction methods
- Automatic fallback to other servers if one fails
- M3U8 and MP4 support

### 3. **Automatic Retry & Fallback**
- Requests automatically retry up to 3 times with exponential backoff
- If primary server fails, automatically tries alternative servers
- Handles rate limiting (429 errors) gracefully

### 4. **Better Error Messages**
All errors now include:
- Clear explanation of what went wrong
- Expected vs provided values
- Example usage
- Available alternatives

### 5. **Environment Configuration**
All settings now configurable via `.env` file (see `.env.example`)

## 🚀 Deployment Steps

### Option 1: No Changes Needed (Backward Compatible)
Simply deploy as-is! Everything works without any configuration changes.

### Option 2: Customize with Environment Variables

1. **Copy the example environment file:**
```bash
cp .env.example .env
```

2. **Edit `.env` to customize:**
```bash
# Adjust timeouts
REQUEST_TIMEOUT=10000
STREAM_TIMEOUT=15000

# Configure retry behavior
MAX_RETRY_ATTEMPTS=3
RETRY_BASE_DELAY=1000

# Set rate limits
RATE_LIMIT_LIMIT=100

# Control logging
LOG_LEVEL=INFO  # Options: ERROR, WARN, INFO, DEBUG
```

3. **Deploy normally:**
```bash
bun install
bun start
```

## 🔍 Testing Your Deployment

### Test Basic Functionality
```bash
# Test server is running
curl http://localhost:5000/ping

# Test streaming endpoint
curl "http://localhost:5000/api/v1/stream?id=steinsgate-3?ep=213&server=HD-1&type=sub"

# Test with different servers
curl "http://localhost:5000/api/v1/stream?id=steinsgate-3?ep=213&server=HD-2&type=sub"
```

### Test Rate Limiting
```bash
# Make 150 rapid requests (should hit rate limit around 100)
for i in {1..150}; do 
  curl http://localhost:5000/api/v1/ping
  echo " - Request $i"
done
```

### Test Error Handling
```bash
# Test with invalid input (should return helpful error)
curl "http://localhost:5000/api/v1/stream?id=invalid"

# Test with missing episode
curl "http://localhost:5000/api/v1/servers?id=invalid"
```

## 📊 Monitoring

### Check Logs
With the new logging system, you can:

```bash
# Set log level in .env
LOG_LEVEL=DEBUG  # See everything
LOG_LEVEL=INFO   # Normal operation (default)
LOG_LEVEL=WARN   # Only warnings and errors
LOG_LEVEL=ERROR  # Only errors
```

### What to Watch For
- **Retry messages**: Indicates network issues or server problems
- **Fallback messages**: Indicates primary server failed, using backup
- **Rate limit warnings**: Clients hitting rate limits
- **Extraction errors**: Problems getting stream links

## 🔧 Configuration Reference

### Key Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Server port |
| `LOG_LEVEL` | INFO | Logging verbosity |
| `REQUEST_TIMEOUT` | 10000 | API request timeout (ms) |
| `STREAM_TIMEOUT` | 15000 | Stream extraction timeout (ms) |
| `MAX_RETRY_ATTEMPTS` | 3 | Number of retry attempts |
| `RATE_LIMIT_LIMIT` | 100 | Requests per window |
| `RATE_LIMIT_WINDOW_MS` | 60000 | Rate limit window (ms) |
| `ENABLE_FALLBACK` | true | Use fallback servers |
| `ENABLE_RETRY` | true | Retry failed requests |

See `.env.example` for complete list.

## 🎯 Performance Tips

### For High Traffic
```bash
# Increase rate limits
RATE_LIMIT_LIMIT=500

# Reduce timeouts for faster failures
REQUEST_TIMEOUT=5000

# Enable all features
ENABLE_FALLBACK=true
ENABLE_RETRY=true
ENABLE_CACHE=true
```

### For Reliability
```bash
# More aggressive retry
MAX_RETRY_ATTEMPTS=5
RETRY_BASE_DELAY=2000

# Longer timeouts
REQUEST_TIMEOUT=15000
STREAM_TIMEOUT=20000
```

### For Debugging
```bash
# Maximum logging
LOG_LEVEL=DEBUG

# Disable retry to see raw errors
ENABLE_RETRY=false
```

## 🚨 Troubleshooting

### "All extraction methods failed"
- **Cause**: All streaming servers are down or blocked
- **Solution**: Check if source site (hianime.to) is accessible
- **Workaround**: Try different anime or wait and retry

### "Rate limit exceeded"
- **Cause**: Client exceeded rate limit
- **Solution**: This is working as intended
- **Adjust**: Increase `RATE_LIMIT_LIMIT` if needed

### "Request timeout"
- **Cause**: Source site is slow or unresponsive
- **Solution**: Retry is automatic
- **Adjust**: Increase `REQUEST_TIMEOUT` if needed

### Logs show many retries
- **Cause**: Network issues or source site problems
- **Solution**: Usually resolves automatically
- **Monitor**: If persistent, check source site status

## 📈 What Users Will Notice

### Improvements
- ✅ **More reliable streaming**: Automatic fallback to working servers
- ✅ **Faster error recovery**: Automatic retries on failures
- ✅ **Better error messages**: Clear explanations with examples
- ✅ **Higher uptime**: Multiple server options prevent total failures

### No Breaking Changes
- ✅ All existing API calls work exactly the same
- ✅ Response formats unchanged
- ✅ No required configuration changes
- ✅ Drop-in replacement for existing deployments

## 📚 Documentation

See these files for more information:
- `IMPROVEMENTS.md` - Detailed technical changes
- `CHANGELOG.md` - Version history
- `.env.example` - Configuration options
- `README.md` - API documentation

## 🎉 You're Done!

Your API is now production-ready with:
- 4+ streaming server support
- Automatic retry and fallback
- Comprehensive error handling
- Advanced logging and debugging
- Environment-based configuration

**No action required** - just deploy and enjoy the improvements! 🚀

---

## Need Help?

If you encounter any issues:
1. Check logs with `LOG_LEVEL=DEBUG`
2. Review `IMPROVEMENTS.md` for technical details
3. Open an issue on GitHub with logs and error messages
