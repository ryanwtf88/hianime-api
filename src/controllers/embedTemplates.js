// Inlined HTML template for Cloudflare Workers compatibility
export const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>MEGACLOUD</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="/jwplayer/jwplayer.js"></script>
    <style>{{STYLES}}</style>
</head>
<body>
    <div id="player"></div>
    <button id="skip-intro-btn" class="skip-button" style="display: none;">Skip Intro</button>
    <button id="skip-outro-btn" class="skip-button" style="display: none;">Skip Outro</button>
    <script>
        const m3u8Url = '{{M3U8_URL}}';
        const subtitles = {{SUBTITLES_JSON}};
        const intro = {{INTRO_JSON}};
        const outro = {{OUTRO_JSON}};
        const autoPlay = {{AUTOPLAY}};
        const autoSkipIntro = {{SKIP_INTRO}};
        const episodeTitle = '{{EPISODE_TITLE}}';
        const tracks = subtitles.map(track => ({ file: track.file, label: track.label, kind: 'captions' }));
        const player = jwplayer('player');
        player.setup({ file: m3u8Url, type: 'hls', title: episodeTitle || 'Episode', mediaid: '{{MEDIA_ID}}', tracks: tracks, autostart: autoPlay, width: '100%', height: '100%', stretching: 'uniform', preload: 'auto', controls: true, displaytitle: true, displaydescription: false, hlshtml: true, primary: 'html5', cast: {}, sharing: false, related: { displayMode: 'none' }, playbackRateControls: [0.5, 0.75, 1, 1.25, 1.5, 2], renderCaptionsNatively: false, qualityLabels: { '1080': '1080p', '720': '720p', '480': '480p', '360': '360p', '240': '240p' }, defaultQuality: 'auto', hlsjsdefault: { maxBufferLength: 30, maxMaxBufferLength: 600, maxBufferSize: 60000000, maxBufferHole: 0.5, lowBufferWatchdogPeriod: 0.5, highBufferWatchdogPeriod: 3, nudgeOffset: 0.1, nudgeMaxRetry: 3, maxFragLookUpTolerance: 0.25, liveSyncDurationCount: 3, liveMaxLatencyDurationCount: 10, enableWorker: true, enableSoftwareAES: true, startLevel: -1, autoStartLoad: true, abrEwmaDefaultEstimate: 500000, abrBandWidthFactor: 0.95, abrBandWidthUpFactor: 0.7, abrMaxWithRealBitrate: true, maxStarvationDelay: 4, maxLoadingDelay: 4, minAutoBitrate: 0 }, aspectratio: '16:9', skin: { name: 'seven' } });
        let introSkipped = false, outroSkipped = false;
        const skipIntroBtn = document.getElementById('skip-intro-btn'), skipOutroBtn = document.getElementById('skip-outro-btn');
        if (intro && intro.end > 0) { skipIntroBtn.onclick = () => { player.seek(intro.end); introSkipped = true; skipIntroBtn.style.display = 'none'; }; }
        if (outro && outro.end > 0) { skipOutroBtn.onclick = () => { player.seek(outro.end); outroSkipped = true; skipOutroBtn.style.display = 'none'; }; }
        player.on('time', e => { const t = e.position; if (intro && intro.end > 0 && !introSkipped) { if (t >= intro.start && t < intro.end) { if (autoSkipIntro) { player.seek(intro.end); introSkipped = true; } else { skipIntroBtn.style.display = 'block'; } } else { skipIntroBtn.style.display = 'none'; } } if (outro && outro.end > 0 && !outroSkipped) { if (t >= outro.start && t < outro.end) { skipOutroBtn.style.display = 'block'; } else { skipOutroBtn.style.display = 'none'; } } });
        player.on('complete', () => window.parent.postMessage({ type: 'NEXT_EPISODE' }, '*'));
    </script>
</body>
</html>`;

export const cssTemplate = `* { margin: 0; padding: 0; box-sizing: border-box; } html, body { width: 100%; height: 100%; overflow: hidden; background: #000; } #player { width: 100%; height: 100%; } .jw-video { background: #000 !important; } .jw-media video { width: 100% !important; height: 100% !important; display: block !important; visibility: visible !important; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; filter: contrast(1.05) saturate(1.1) brightness(1.02); -webkit-filter: contrast(1.05) saturate(1.1) brightness(1.02); } .jw-media { background: transparent !important; } .jw-preview { display: none !important; } .jw-display { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; display: flex !important; align-items: center !important; justify-content: center !important; } .jw-display-icon-container { position: relative !important; width: 80px !important; height: 80px !important; } .jw-display-icon-container .jw-icon { width: 80px !important; height: 80px !important; display: block !important; } .jw-display-icon-container .jw-svg-icon { width: 100% !important; height: 100% !important; } .jw-state-playing .jw-display { display: none !important; } .jw-state-playing:hover .jw-display { display: flex !important; } .jw-state-paused .jw-display, .jw-state-idle .jw-display, .jw-state-buffering .jw-display, .jw-state-complete .jw-display { display: flex !important; } .jw-progress { position: relative; } .jw-progress-highlights { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999 !important; } .jw-progress-highlight { position: absolute; top: 0; height: 100%; opacity: 0.9; pointer-events: none; z-index: 999 !important; } .intro-highlight, .outro-highlight { background: #00a0ff; } .jw-progress .jw-buffer, .jw-progress .jw-progress-played, .jw-progress .jw-progress-seek { z-index: 1 !important; } .jw-slider-time { position: relative; z-index: 1 !important; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } .jw-svg-icon-buffer { animation: spin 1s linear infinite; } .skip-button { position: absolute; bottom: 80px; right: 20px; background: rgba(0, 0, 0, 0.8); color: white; border: 2px solid rgba(255, 255, 255, 0.3); padding: 12px 24px; font-size: 14px; font-weight: 600; cursor: pointer; border-radius: 4px; z-index: 9999; transition: all 0.3s ease; font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.5px; } .skip-button:hover { background: rgba(255, 255, 255, 0.2); border-color: rgba(255, 255, 255, 0.6); transform: scale(1.05); } .skip-button:active { transform: scale(0.95); } .jw-controlbar .jw-icon { transform: translate(1px, 3px); } .jw-display .jw-icon-rewind, .jw-display .jw-icon-forward-custom { display: none !important; } .jw-text-elapsed, .jw-text-duration { margin-left: 8px; }`;
