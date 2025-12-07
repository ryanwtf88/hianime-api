# Frontend Integration Guide

## 🎯 How the API Works Now

The API returns **three URLs** for maximum compatibility:

```json
{
  "success": true,
  "data": {
    "link": {
      "file": "https://cdn.example.com/video/master.m3u8",        // Primary - Direct URL
      "directUrl": "https://cdn.example.com/video/master.m3u8",   // Same as file
      "proxyUrl": "https://api.animo.qzz.io/api/v1/embed/proxy?url=..." // Redirect wrapper
    }
  }
}
```

---

## ✅ Recommended: Use Direct URL

**This is the best approach:**

```javascript
// Fetch stream
const response = await fetch('https://api.animo.qzz.io/api/v1/stream?id=one-piece-100?ep=1&server=HD-1&type=sub');
const data = await response.json();

// Use direct URL (primary)
const videoUrl = data.data.link.file; // or data.data.link.directUrl

// Load in HLS.js
if (Hls.isSupported()) {
  const hls = new Hls();
  hls.loadSource(videoUrl); // Use direct URL
  hls.attachMedia(videoElement);
}
```

**Benefits:**
- ✅ Works on all platforms
- ✅ Faster (no redirect)
- ✅ Better performance
- ✅ No proxy overhead

---

## 🔄 Alternative: Use Proxy URL (Backwards Compatible)

**If your frontend currently wraps URLs in /proxy:**

```javascript
// Your current code might be:
const cdnUrl = data.data.link.file;
const proxiedUrl = `/api/v1/proxy?url=${encodeURIComponent(cdnUrl)}`;

// Change to:
const proxiedUrl = data.data.link.proxyUrl; // Use pre-built proxy URL
```

**What happens:**
1. Frontend loads `proxyUrl`
2. API returns M3U8 redirect pointing to direct URL
3. HLS.js follows redirect and loads from CDN
4. Video plays normally

**Note:** This adds one extra request but maintains compatibility.

---

## 📝 Complete Example

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
</head>
<body>
    <video id="video" controls width="640"></video>
    
    <script>
        const API_BASE = 'https://api.animo.qzz.io';
        const video = document.getElementById('video');
        
        async function loadVideo(animeId, episode, server = 'HD-1', type = 'sub') {
            try {
                // Get stream URL
                const streamUrl = `${API_BASE}/api/v1/stream?id=${animeId}?ep=${episode}&server=${server}&type=${type}`;
                const response = await fetch(streamUrl);
                const data = await response.json();
                
                if (!data.success) {
                    console.error('Failed to get stream:', data);
                    return;
                }
                
                // Method 1: Use direct URL (recommended)
                const videoUrl = data.data.link.file;
                
                // Method 2: Use proxy URL (if needed)
                // const videoUrl = data.data.link.proxyUrl;
                
                console.log('Loading video from:', videoUrl);
                
                // Initialize HLS.js
                if (Hls.isSupported()) {
                    const hls = new Hls({
                        debug: false,
                        enableWorker: true,
                    });
                    
                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        console.log('✅ Video ready to play');
                        video.play();
                    });
                    
                    hls.on(Hls.Events.ERROR, (event, data) => {
                        console.error('HLS Error:', data.type, data.details);
                        
                        if (data.fatal) {
                            switch (data.type) {
                                case Hls.ErrorTypes.NETWORK_ERROR:
                                    console.error('Network error - retrying...');
                                    hls.startLoad();
                                    break;
                                case Hls.ErrorTypes.MEDIA_ERROR:
                                    console.error('Media error - recovering...');
                                    hls.recoverMediaError();
                                    break;
                                default:
                                    console.error('Fatal error - cannot recover');
                                    hls.destroy();
                                    break;
                            }
                        }
                    });
                    
                    hls.loadSource(videoUrl);
                    hls.attachMedia(video);
                    
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    // Native HLS support (Safari)
                    video.src = videoUrl;
                    video.addEventListener('loadedmetadata', () => {
                        video.play();
                    });
                }
                
            } catch (error) {
                console.error('Error loading video:', error);
            }
        }
        
        // Load a video
        loadVideo('one-piece-100', 1);
    </script>
</body>
</html>
```

---

## 🔍 Testing Checklist

### 1. Check API Response
```javascript
const response = await fetch('https://api.animo.qzz.io/api/v1/stream?id=one-piece-100?ep=1&server=HD-1&type=sub');
const data = await response.json();
console.log('Direct URL:', data.data.link.file);
console.log('Proxy URL:', data.data.link.proxyUrl);
```

**Expected:**
- `file`: Direct CDN URL (e.g., `https://cdn.example.com/...`)
- `proxyUrl`: API proxy URL (e.g., `https://api.animo.qzz.io/api/v1/embed/proxy?url=...`)

### 2. Test Direct URL Loading
```javascript
// Should work from browser
fetch(data.data.link.file)
  .then(r => r.text())
  .then(m3u8 => console.log('M3U8 content:', m3u8.substring(0, 100)))
  .catch(e => console.error('Failed:', e));
```

### 3. Test in Browser DevTools

**Network Tab should show:**
```
✅ GET https://cdn.example.com/master.m3u8 200 OK
✅ GET https://cdn.example.com/index.m3u8 200 OK
✅ GET https://cdn.example.com/seg-1.ts 200 OK
```

**Should NOT show:**
```
❌ GET /api/v1/proxy?url=... 403/521
❌ manifestLoadError
❌ fragParsingError
```

---

## 🚨 Common Issues

### Issue 1: Still getting 403/521 errors

**Cause:** Frontend is still wrapping URLs in old proxy format

**Fix:** Use `data.data.link.file` directly or use `data.data.link.proxyUrl`

### Issue 2: Video loads but doesn't play

**Cause:** CDN URLs expired (valid for ~5 minutes)

**Fix:** Refresh stream URL by calling API again

### Issue 3: CORS errors

**Cause:** Shouldn't happen - CDN has CORS enabled

**Fix:** Make sure you're not using `mode: 'no-cors'` in fetch

---

## 📊 URL Comparison

| Approach | URL Format | How It Works | Performance |
|----------|-----------|--------------|-------------|
| **Direct (Recommended)** | `https://cdn.example.com/video.m3u8` | Browser → CDN directly | ⚡ Fastest |
| **Proxy URL** | `https://api.animo.qzz.io/api/v1/embed/proxy?url=...` | Browser → API → Redirect → CDN | ✅ Works, slower |
| **Old Proxy** | `https://api.animo.qzz.io/api/v1/proxy?url=...` | Browser → API (tries to fetch CDN) | ❌ Fails (403/521) |

---

## ✨ Best Practices

1. **Use direct URLs** - Fastest and most reliable
2. **Handle URL expiration** - Refresh after 5 minutes if needed
3. **Error recovery** - Implement retry logic in HLS.js error handler
4. **Loading states** - Show loading indicator while manifest loads
5. **Fallback** - If direct URL fails, try proxy URL

---

## 🔗 API Endpoints

### Stream Endpoint
```
GET https://api.animo.qzz.io/api/v1/stream?id={animeId}&server={server}&type={type}
```

**Parameters:**
- `id` - Anime ID with episode (e.g., `one-piece-100?ep=1`)
- `server` - Server name (e.g., `HD-1`, `HD-2`)
- `type` - Audio type (`sub` or `dub`)

**Response:**
```json
{
  "success": true,
  "data": {
    "link": {
      "file": "https://cdn.example.com/video.m3u8",
      "directUrl": "https://cdn.example.com/video.m3u8",
      "proxyUrl": "https://api.animo.qzz.io/api/v1/embed/proxy?url=..."
    }
  }
}
```

### Other Endpoints
- `/api/v1/home` - Homepage content
- `/api/v1/anime/{id}` - Anime details
- `/api/v1/search?q={query}` - Search anime
- `/api/v1/embed/proxy?url={url}` - M3U8 proxy redirect

---

## 🆘 Need Help?

If videos still don't work:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Check Network tab for failed requests
5. Share the error message

The direct URLs will work from any browser! 🚀
