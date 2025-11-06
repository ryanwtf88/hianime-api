# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-11-06

### 🚀 Major Release - Complete Codebase Overhaul

This release represents a comprehensive systematic improvement of the entire codebase with bug fixes, new features, and production-ready enhancements.

### 🐛 Bug Fixes

- **Fixed typos**: Corrected "validaion" → "validation" in error messages
- **Fixed rate limiter**: Now properly uses client IP instead of a static key, making it actually effective
- **Fixed error messages**: Improved clarity with "unexpected" spelling correction

### ✨ New Features

#### Multiple Streaming Server Support
- Added **StreamWish** decryptor with full extraction support
- Added **VidStreaming** decryptor with multiple parsing methods
- Added **Filemoon** decryptor with packed JavaScript unpacking
- Added **MP4Upload** decryptor with M3U8 and MP4 support
- Implemented smart server detection based on server names
- Added automatic fallback chain: Primary → Megacloud → StreamWish → VidStreaming

#### Advanced Retry Logic
- Exponential backoff retry mechanism (1s → 2s → 4s)
- Configurable retry attempts (default: 3)
- Smart retry: Doesn't retry on 4xx errors (except 429)
- Rate limit handling with `retry-after` header respect
- Timeout handling with proper cleanup

#### Comprehensive Logging System
- New structured logger with levels: ERROR, WARN, INFO, DEBUG
- Environment-based log level control
- Timestamps and context in all log messages
- Request/Response tracking helpers
- Error stack trace preservation

#### Enhanced Configuration
- Environment variable support for all settings
- Organized configuration sections:
  - Base URLs and providers
  - Timeout configurations
  - Retry settings
  - Cache TTLs per endpoint type
  - Rate limiting parameters
  - Feature flags
- Full `.env.example` template included

### 🛡️ Improved Error Handling

#### Stream Controller
- Comprehensive input validation (type checking, format validation)
- Detailed error messages with examples
- Shows available alternatives on error
- Graceful error wrapping with context preservation

#### Servers Controller
- Episode ID format validation
- Response structure validation
- Enhanced timeout handling (10s timeout)
- Better error context with examples

#### Server Extraction
- HTML input validation before parsing
- Partial failure handling (skips incomplete servers)
- Safe parsing with try-catch per server
- Fallback values on parse failure

#### Megacloud Decryptor
- Proper timeout configuration (10s API, 5s key fetch)
- Token validation before usage
- Decryption result verification
- Enhanced fallback with better error messages

### 📊 Code Quality Improvements

- **Input Validation**: All controllers now validate parameters with helpful error messages
- **Error Context**: Errors include what went wrong, expected vs provided values, and examples
- **Consistent Error Handling**: Custom error classes with proper HTTP status codes
- **Better HTTP Headers**: All requests include proper User-Agent, Referer, and other headers

### 🔧 Configuration Management

All settings now configurable via environment variables:
- Request timeouts (default: 10s, stream: 15s, extraction: 20s)
- Retry configuration (attempts, base delay)
- Rate limiting (window, limit)
- Cache TTLs (homepage, search, anime, episode)
- Feature flags (fallback, retry, cache)

### 📈 Performance Improvements

- Connection reuse headers
- Abort controller for proper timeout handling
- Parallel requests where possible
- Smart caching with configurable TTLs
- Per-client rate limiting (not global)

### 🔍 Debugging Improvements

- Structured logging with request context
- Full error stack traces
- Request/response duration tracking
- Attempt number in retry logs
- Path and method logged for all errors

### 📁 New Files

- `src/utils/logger.js` - Centralized logging system
- `src/parsers/decryptor/streamwish.js` - StreamWish support
- `src/parsers/decryptor/vidstreaming.js` - VidStreaming support
- `src/parsers/decryptor/filemoon.js` - Filemoon support
- `src/parsers/decryptor/mp4upload.js` - MP4Upload support
- `.env.example` - Environment configuration template
- `IMPROVEMENTS.md` - Detailed improvement documentation
- `CHANGELOG.md` - This file

### 📝 Updated Files

- `src/app.js` - Better error handling, logging, config integration
- `src/config/config.js` - Comprehensive environment-based configuration
- `src/utils/errors.js` - Fixed typo in error message
- `src/services/axiosInstance.js` - Retry logic, exponential backoff, better headers
- `src/controllers/streamController.js` - Full input validation, detailed errors
- `src/controllers/serversController.js` - Validation, error context, examples
- `src/extractor/extractStream.js` - Multi-server support, smart fallbacks
- `src/extractor/extractServers.js` - Robust parsing, input validation
- `src/parsers/decryptor/megacloud.js` - Enhanced error handling, timeouts

### 🎯 Key Benefits

1. **Reliability**: 4+ streaming servers with automatic fallback
2. **Debuggability**: Comprehensive logging with context
3. **Flexibility**: Easy configuration via environment variables
4. **Robustness**: Input validation prevents crashes
5. **Maintainability**: Clean, well-documented code
6. **Performance**: Smart caching and timeout handling
7. **Security**: Proper rate limiting per client
8. **User Experience**: Helpful error messages with examples

### ⚙️ Environment Variables

See `.env.example` for all available configuration options including:
- BASE_URL, BASE_URL_V2
- REQUEST_TIMEOUT, STREAM_TIMEOUT, EXTRACTION_TIMEOUT
- MAX_RETRY_ATTEMPTS, RETRY_BASE_DELAY
- RATE_LIMIT_WINDOW_MS, RATE_LIMIT_LIMIT
- CACHE_TTL_* (various endpoints)
- ENABLE_FALLBACK, ENABLE_RETRY, ENABLE_CACHE
- LOG_LEVEL

### 🔄 Migration Notes

**This release is 100% backward compatible.** All existing API consumers will continue to work without any changes, but will automatically benefit from:
- More reliable streaming (4+ server options)
- Better error messages
- Automatic retry on failures
- Alternative server fallbacks

### 📚 Documentation

- Added `IMPROVEMENTS.md` with comprehensive documentation of all changes
- Added `.env.example` with detailed configuration comments
- All improvements maintain API compatibility

### 🧪 Testing Recommendations

Test the following scenarios:
1. Rate limiting with rapid requests
2. Retry logic with network issues
3. Fallback servers when primary fails
4. Input validation with invalid IDs
5. Multiple streaming servers
6. Different log levels

### 🎉 Summary

This release transforms the codebase from a basic scraper to a **production-ready API** with:
- ✅ 4+ streaming server support (up from 1-2)
- ✅ Automatic retry and fallback mechanisms
- ✅ Comprehensive error handling and validation
- ✅ Advanced logging and debugging
- ✅ Environment-based configuration
- ✅ Proper rate limiting by client IP
- ✅ Enhanced code quality and maintainability

All improvements are **backward compatible** while providing significant reliability and user experience enhancements! 🚀

---

## [1.0.0] - Previous Release

Initial release of hianime-api with basic scraping functionality.
