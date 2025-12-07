import { validationError } from '../utils/errors.js';
import { extractStream } from '../extractor/extractStream.js';
import { getServers } from './serversController.js';

const embedController = async (c) => {
    try {
        let { id, server, type } = c.req.param();

        if (!id) id = c.req.query('id');
        if (!server) server = c.req.query('server');
        if (!type) type = c.req.query('type');

        if (!id) return c.text('ID is required', 400);

        server = server ? server.toUpperCase() : 'HD-2';
        type = type || 'sub';

        const serverMapping = {
            'S-1': 'MEGACLOUD',
            'HD-2': 'MEGACLOUD'
        };

        const mappedServer = serverMapping[server] || server;
        const servers = await getServers(id);
        let selectedServer = null;

        if (server.startsWith('S-')) {
            const index = parseInt(server.replace('S-', ''));
            selectedServer = servers[type].find(el => el.index === index);
        }

        if (!selectedServer && mappedServer === 'MEGACLOUD') {
            selectedServer = servers[type].find(el => el.index === 1) || servers[type].find(el => el.index === 4);
        }

        if (!selectedServer) {
            selectedServer = servers[type].find(el => el.name.toUpperCase() === mappedServer);
        }

        if (!selectedServer) {
            selectedServer = servers[type].find(el => el.name.toUpperCase() === server);
        }

        if (!selectedServer) {
            selectedServer = servers[type].find((el) => el.name.toUpperCase().includes(mappedServer));
        }

        if (!selectedServer) return c.text(`Server ${server} not found`, 404);

        const stream = await extractStream({ selectedServer, id });

        if (!stream || !stream.link || !stream.link.file) {
            return c.text('Failed to extract stream', 500);
        }

        // Use proxied URL (via Vercel) - CDN needs CORS headers added
        const m3u8Url = stream.link.file; // Already proxied from extractStream
        const tracks = stream.tracks || [];
        const intro = stream.intro || {};
        const outro = stream.outro || {};

        // Pass the episode type (sub/dub) to the player
        const episodeType = type || 'sub';
        
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Watch Anime</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="module" src="https://cdn.jsdelivr.net/npm/media-chrome/+esm"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/media-chrome/menu/+esm"></script>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; font-family: Roboto, Arial, sans-serif; }
        
        media-controller {
            width: 100%; height: 100%; display: block; font-size: 13px;
            font-family: Roboto, Arial, sans-serif;
            --media-font-family: Roboto, helvetica neue, segoe ui, arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            --media-secondary-color: transparent;
            --media-menu-background: rgba(28, 28, 28, 0.95);
            --media-control-hover-background: var(--media-secondary-color);
            --media-range-track-height: 3px;
            --media-range-thumb-height: 13px;
            --media-range-thumb-width: 13px;
            --media-range-thumb-border-radius: 13px;
            --media-preview-thumbnail-border: 2px solid #fff;
            --media-preview-thumbnail-border-radius: 2px;
            --media-tooltip-display: none;
        }

        .skip-button {
            background: rgba(0, 0, 0, 0.8); border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff; padding: 8px 16px; border-radius: 4px; cursor: pointer;
            font-weight: 500; font-size: 14px; display: none; align-items: center;
            gap: 8px; pointer-events: auto; margin-bottom: 10px;
        }
        
        .skip-container {
             position: absolute; bottom: 60px; right: 20px; display: flex;
             flex-direction: column; align-items: flex-end; z-index: 20; pointer-events: none;
        }

        .skip-button.visible { display: flex; }
        .skip-button:hover { background: rgba(255, 255, 255, 0.1); }

        video { width: 100%; height: 100%; }

        /* Subtitle Styling - Much smaller and positioned as overlay */
        video::cue {
            background-color: rgba(0, 0, 0, 0.75);
            color: #ffffff;
            font-size: 14px;
            font-family: Arial, sans-serif;
            font-weight: 400;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
            line-height: 1.3;
            padding: 2px 6px;
            border-radius: 2px;
        }
        
        [mediaisfullscreen] video::cue {
            font-size: 18px;
            padding: 3px 7px;
        }

        /* Position subtitles above controls */
        video::-webkit-media-text-track-container {
            bottom: 80px !important;
        }
        
        [mediaisfullscreen] video::-webkit-media-text-track-container {
            bottom: 100px !important;
        }

        media-controller[mediaisfullscreen] {
          font-size: 17px; --media-range-thumb-height: 20px;
          --media-range-thumb-width: 20px; --media-range-thumb-border-radius: 10px;
          --media-range-track-height: 4px;
        }
    
        .yt-button {
          position: relative; display: inline-block; width: 36px; padding: 0 2px;
          height: 100%; opacity: 0.9; transition: opacity 0.1s cubic-bezier(0.4, 0, 1, 1);
        }
        [breakpointmd] .yt-button { width: 48px; }
        [mediaisfullscreen] .yt-button { width: 54px; }
    
        .yt-button svg { height: 100%; width: 100%; fill: var(--media-primary-color, #fff); fill-rule: evenodd; }
        .svg-shadow { stroke: #000; stroke-opacity: 0.15; stroke-width: 2px; fill: none; }
        
        .yt-gradient-bottom {
            padding-top: 37px; position: absolute; width: 100%; height: 170px;
            bottom: 0; pointer-events: none; background-position: bottom; background-repeat: repeat-x;
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAACqCAYAAABsziWkAAAAAXNSR0IArs4c6QAAAQVJREFUOE9lyNdHBQAAhfHb3nvvuu2997jNe29TJJEkkkgSSSSJJJJEEkkiifRH5jsP56Xz8PM5gcC/xfDEmjhKxEOCSaREEiSbFEqkQppJpzJMJiWyINvkUCIX8kw+JQqg0BRRxaaEEqVQZsopUQGVpooS1VBjglStqaNEPTSYRko0QbNpoUQrtJl2qsN0UqILuk0PJXqhz/RTYgAGzRA1bEYoMQpjZpwSExAyk5SYgmkzQ82aOUqEIWKilJiHBbNIiSVYhhVYhTVYhw3YhC3Yhh3YhT3YhwM4hCM4hhM4hTM4hwu4hCu4hhu4hTu4hwd4hCd4hhd4hTd4hw/4hC/4hh/4/QM2/id28uIEJAAAAABJRU5ErkJggg==');
            z-index: 10;
        }

        media-settings-menu {
            position: absolute; border-radius: 12px; right: 12px; bottom: 61px; z-index: 70;
            will-change: width, height; text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
            transition: opacity 0.1s cubic-bezier(0, 0, 0.2, 1); user-select: none;
            --media-settings-menu-min-width: 240px;
        }
        [mediaisfullscreen] media-settings-menu {
            --media-settings-menu-min-width: 320px; right: 24px; bottom: 70px;
        }
        media-settings-menu-item {
            height: 44px; font-size: 14px; font-weight: 500;
            padding: 0 16px; display: flex; align-items: center; justify-content: space-between;
            cursor: pointer; transition: background 0.2s;
        }
        media-settings-menu-item:hover { background: rgba(255, 255, 255, 0.1); }
        [mediaisfullscreen] media-settings-menu-item { font-size: 18px; height: 52px; }
        
        media-time-range {
            position: absolute; bottom: 36px; width: 100%; height: 5px; z-index: 20;
            --media-range-track-background: rgba(255, 255, 255, 0.2);
            --media-range-track-pointer-background: rgba(255, 255, 255, 0.5);
            --media-time-range-buffered-color: rgba(255, 255, 255, 0.4);
            --media-range-bar-color: var(--media-accent-color, rgb(229, 9, 20));
            --media-range-thumb-border-radius: 13px;
            --media-range-thumb-background: var(--media-accent-color, #f00);
            --media-range-thumb-transform: scale(0) translate(0%, 0%);
        }
        media-time-range:hover {
            --media-range-track-height: 5px; --media-range-thumb-transform: scale(1) translate(0%, 0%);
        }
        [breakpointmd] media-time-range { bottom: 47px; }
        [mediaisfullscreen] media-time-range { bottom: 52.5px; height: 8px; }
        [mediaisfullscreen] media-time-range:hover { --media-range-track-height: 8px; }

        /* Intro/Outro highlights on progress bar */
        .intro-highlight, .outro-highlight {
            position: absolute;
            height: 100%;
            background-color: rgba(33, 150, 243, 0.6);
            top: 0;
            pointer-events: none;
            z-index: 1;
        }

        media-control-bar {
            position: absolute; height: 36px; line-height: 36px;
            bottom: 0; left: 12px; right: 12px; z-index: 20;
        }
        [breakpointmd] media-control-bar { height: 48px; line-height: 48px; }
        [mediaisfullscreen] media-control-bar { height: 54px; line-height: 54px; }

        media-play-button { --media-button-icon-width: 30px; padding: 6px 10px; }
        media-play-button #icon-play, media-play-button #icon-pause { filter: drop-shadow(0 0 2px #00000080); }
        media-play-button :is(#play-p1, #play-p2, #pause-p1, #pause-p2) { transition: clip-path 0.25s ease-in; }
        media-play-button:not([mediapaused]) #play-p2 { transition: clip-path 0.35s ease-in; }
        media-play-button :is(#pause-p1, #pause-p2), media-play-button[mediapaused] :is(#play-p1, #play-p2) { clip-path: inset(0); }
        media-play-button #play-p1 { clip-path: inset(0 100% 0 0); }
        media-play-button #play-p2 { clip-path: inset(0 20% 0 100%); }
        media-play-button[mediapaused] #pause-p1 { clip-path: inset(50% 0 50% 0); }
        media-play-button[mediapaused] #pause-p2 { clip-path: inset(50% 0 50% 0); }

        media-mute-button :is(#icon-muted, #icon-volume) { transition: clip-path 0.3s ease-out; }
        media-mute-button #icon-muted { clip-path: inset(0 0 100% 0); }
        media-mute-button[mediavolumelevel='off'] #icon-muted { clip-path: inset(0); }
        media-mute-button #icon-volume { clip-path: inset(0); }
        media-mute-button[mediavolumelevel='off'] #icon-volume { clip-path: inset(100% 0 0 0); }
        
        media-volume-range { height: 36px; --media-range-track-background: rgba(255, 255, 255, 0.2); }
        media-mute-button + media-volume-range { width: 0; overflow: hidden; transition: width 0.2s ease-in; }
        media-mute-button:hover + media-volume-range, media-mute-button:focus + media-volume-range,
        media-mute-button:focus-within + media-volume-range, media-volume-range:hover,
        media-volume-range:focus, media-volume-range:focus-within { width: 70px; }

        media-time-display { padding-top: 6px; padding-bottom: 6px; font-size: 13px; }
        [mediaisfullscreen] media-time-display { font-size: 20px; }
        .control-spacer { flex-grow: 1; }

        media-captions-button { position: relative; }
        
        /* CC button inactive state */
        media-captions-button:not([mediasubtitleslist]) svg { 
            opacity: 0.3; 
        }
        
        /* CC button active state - improved */
        media-captions-button[aria-checked='true'] {
            position: relative;
        }
        
        media-captions-button[aria-checked='true']::after {
            content: '';
            position: absolute;
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            width: 60%;
            height: 3px;
            background: #e50914;
            border-radius: 2px;
        }

        media-settings-menu-button svg { transition: transform 0.1s cubic-bezier(0.4, 0, 1, 1); transform: rotateZ(0deg); }
        media-settings-menu-button[aria-expanded='true'] svg { transform: rotateZ(30deg); }

        /* Seek button labels */
        media-seek-backward-button::part(display),
        media-seek-forward-button::part(display) {
            font-size: 12px;
        }

        .mobile-centered-controls {
            display: flex; align-self: stretch; align-items: center; flex-flow: row nowrap;
            justify-content: center; margin: -5% auto 0; width: 100%; gap: 1rem;
        }
        .mobile-centered-controls [role='button'] {
            --media-icon-color: var(--media-primary-color, #fff); background: rgba(0, 0, 0, 0.5);
            --media-button-icon-width: 36px; --media-button-icon-height: 36px;
            border-radius: 50%; user-select: none; aspect-ratio: 1;
        }
        .mobile-centered-controls media-play-button { width: 5rem; }
        .mobile-centered-controls :is(media-seek-backward-button, media-seek-forward-button) { width: 3rem; padding: 0.5rem; }
        @media (width >= 768px) { .mobile-centered-controls { display: none; } }

        /* Custom menu styling - improved */
        .custom-menu {
            display: none; position: absolute; right: 12px; bottom: 61px;
            background: rgba(28, 28, 28, 0.98); border-radius: 12px;
            min-width: 260px; max-height: 400px; overflow-y: auto;
            z-index: 80; backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .custom-menu.active { display: block; animation: slideIn 0.2s ease-out; }
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .menu-item {
            padding: 14px 18px; cursor: pointer; font-size: 15px;
            display: flex; align-items: center; justify-content: space-between;
            transition: background 0.15s ease; color: #fff;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .menu-item:last-child { border-bottom: none; }
        .menu-item:hover { background: rgba(255, 255, 255, 0.12); }
        .menu-item.active { 
            color: #2196f3; 
            background: rgba(33, 150, 243, 0.1);
        }
        .menu-item.active::after {
            content: '✓';
            font-size: 18px;
            font-weight: bold;
        }
        .menu-header {
            padding: 14px 18px; font-weight: 600; 
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
            display: flex; align-items: center; gap: 8px; cursor: pointer;
            background: rgba(255, 255, 255, 0.05);
            position: sticky; top: 0; z-index: 1;
        }
        .menu-header:hover { background: rgba(255, 255, 255, 0.08); }
    </style>
</head>
<body>
      <media-controller breakpoints="md:480" defaultsubtitles gesturesdisabled defaultstreamtype="on-demand">
        <video slot="media" id="video-player" crossorigin="anonymous" playsinline autoplay></video>
        
        <div class="yt-gradient-bottom"></div>

        <div class="skip-container" slot="centered-chrome">
            <div id="skip-intro" class="skip-button">
                Skip Intro <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.713 3.31 4 3.655 4 4.308v7.384c0 .653.713.998 1.233.696L11.5 8.752V12a.5.5 0 0 0 1 0V4z"/></svg>
            </div>
            <div id="skip-outro" class="skip-button">
                Skip Outro <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.713 3.31 4 3.655 4 4.308v7.384c0 .653.713.998 1.233.696L11.5 8.752V12a.5.5 0 0 0 1 0V4z"/></svg>
            </div>
        </div>

        <!-- Custom Settings Menu -->
        <div id="custom-settings-menu" class="custom-menu"></div>

        <media-time-range id="time-range">
          <media-preview-thumbnail slot="preview"></media-preview-thumbnail>
          <media-preview-time-display slot="preview"></media-preview-time-display>
        </media-time-range>

        <media-control-bar>
          <media-play-button mediapaused class="yt-button">
            <svg slot="icon" viewBox="0 0 36 36">
              <g id="icon-play">
                <g id="play-icon">
                  <path id="play-p1" d="M18.5 14L12 10V26L18.5 22V14Z" />
                  <path id="play-p2" d="M18 13.6953L25 18L18 22.3086V13.6953Z" />
                </g>
                <g id="pause-icon">
                  <path id="pause-p1" d="M16 10H12V26H16V10Z" />
                  <path id="pause-p2" d="M21 10H25V26H21V10Z" />
                </g>
              </g>
            </svg>
          </media-play-button>

          <media-mute-button class="yt-button">
            <svg slot="icon" viewBox="0 0 36 36">
                <path d="M13 15H9V21H13L18 26V10L13 15Z" fill="#fff"/>
            </svg>
          </media-mute-button>
          <media-volume-range></media-volume-range>

          <media-time-display showduration></media-time-display>
          <span class="control-spacer"></span>

          <media-captions-button class="yt-button">
             <svg slot="icon" viewBox="0 0 36 36">
               <path d="M11 11c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V13c0-1.1-.9-2-2-2H11zm0 12V13h14v10H11z" fill="#fff"/>
               <path d="M14.5 18.5h-1v-1h1v1zm0-2h-1v-1h1v1zm2 2h-1v-1h1v1zm0-2h-1v-1h1v1zm5.5 2h-1v-1h1v1zm0-2h-1v-1h1v1zm2 2h-1v-1h1v1zm0-2h-1v-1h1v1z" fill="#fff"/>
             </svg>
          </media-captions-button>

          <button id="settings-btn" class="yt-button" style="background: none; border: none; cursor: pointer;">
            <svg viewBox="0 0 36 36">
              <path d="M11.8153 12.0477L14.2235 12.9602C14.6231 12.6567 15.0599 12.3996 15.5258 12.1971L15.9379 9.66561C16.5985 9.50273 17.2891 9.41632 18 9.41632C18.7109 9.41632 19.4016 9.50275 20.0622 9.66566L20.4676 12.1555C20.9584 12.3591 21.418 12.6227 21.8372 12.9372L24.1846 12.0477C25.1391 13.0392 25.8574 14.2597 26.249 15.6186L24.3196 17.1948C24.3531 17.4585 24.3704 17.7272 24.3704 18C24.3704 18.2727 24.3531 18.5415 24.3196 18.8051L26.249 20.3814C25.8574 21.7403 25.1391 22.9607 24.1846 23.9522L21.8372 23.0628C21.4179 23.3772 20.9584 23.6408 20.4676 23.8445L20.0622 26.3343C19.4016 26.4972 18.7109 26.5836 18 26.5836C17.2891 26.5836 16.5985 26.4972 15.9379 26.3344L15.5258 23.8029C15.0599 23.6003 14.6231 23.3433 14.2236 23.0398L11.8154 23.9523C10.8609 22.9608 10.1426 21.7404 9.75098 20.3815L11.7633 18.7375C11.7352 18.4955 11.7208 18.2495 11.7208 18C11.7208 17.7505 11.7352 17.5044 11.7633 17.2625L9.75098 15.6185C10.1426 14.2596 10.8609 13.0392 11.8153 12.0477ZM18 20.75C19.5188 20.75 20.75 19.5188 20.75 18C20.75 16.4812 19.5188 15.25 18 15.25C16.4812 15.25 15.25 16.4812 15.25 18C15.25 19.5188 16.4812 20.75 18 20.75Z" fill="#fff"/>
            </svg>
          </button>

          <media-pip-button class="yt-button">
             <svg slot="icon" viewBox="0 0 36 36">
               <path d="M25 17H17V23H25V17Z" fill="#fff"/>
               <path d="M7 11C7 9.89543 7.89545 9 9 9H27.0161C28.1207 9 29.0161 9.89543 29.0161 11V24.8837C29.0161 25.9883 28.1207 26.8837 27.0162 26.8837H9C7.89545 26.8837 7 25.9883 7 24.8837V11ZM9 11H27V25H9V11Z" fill="#fff"/>
             </svg>
          </media-pip-button>

          <media-fullscreen-button class="yt-button">
            <svg slot="enter" viewBox="0 0 36 36">
              <path d="M10 14V10H14M22 10H26V14M26 22V26H22M14 26H10V22" stroke="#fff" stroke-width="2" fill="none"/>
            </svg>
            <svg slot="exit" viewBox="0 0 36 36">
               <path d="M14 10V14H10M22 14H26V10M26 22V26H22M10 22H14V26" stroke="#fff" stroke-width="2" fill="none"/>
            </svg>
          </media-fullscreen-button>
        </media-control-bar>

        <div class="mobile-centered-controls" slot="centered-chrome">
          <media-seek-backward-button seek-offset="10"></media-seek-backward-button>
          <media-play-button></media-play-button>
          <media-seek-forward-button seek-offset="10"></media-seek-forward-button>
        </div>
      </media-controller>

    <script>
        const intro = ${JSON.stringify(intro || { start: 0, end: 0 })};
        const outro = ${JSON.stringify(outro || { start: 0, end: 0 })};
        const episodeType = '${episodeType}';
        const subtitles = ${JSON.stringify(tracks.filter(t => t.kind === 'captions'))};
        
        
        const video = document.getElementById('video-player');
        const settingsBtn = document.getElementById('settings-btn');
        const settingsMenu = document.getElementById('custom-settings-menu');
        const skipIntroBtn = document.getElementById('skip-intro');
        const skipOutroBtn = document.getElementById('skip-outro');

        let hls = null;
        let currentQuality = -1;
        let currentSpeed = 1;
        let currentSubtitle = null;
        let subtitlesLoaded = false;

        // Initialize HLS with optimized config
        if (Hls.isSupported()) {
            hls = new Hls({
                maxBufferLength: 30,
                maxMaxBufferLength: 60,
                maxBufferSize: 60 * 1000 * 1000,
                maxBufferHole: 0.5,
                highBufferWatchdogPeriod: 2,
                nudgeMaxRetry: 10,
                fragLoadingTimeOut: 30000,
                manifestLoadingTimeOut: 30000,
                levelLoadingTimeOut: 30000,
                startLevel: -1,
                abrEwmaDefaultEstimate: 500000
            });
            
            hls.loadSource('${m3u8Url}');
            hls.attachMedia(video);

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error("HLS Error:", data);
                if (data.fatal) {
                    switch(data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hls.recoverMediaError();
                            break;
                        default:
                            hls.destroy();
                            break;
                    }
                }
            });

            // Load subtitles after manifest is parsed
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                loadSubtitles();
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = '${m3u8Url}';
            video.addEventListener('loadedmetadata', loadSubtitles);
        }

        // Load subtitles function
        function loadSubtitles() {
            // Prevent loading subtitles multiple times
            if (subtitlesLoaded) {
                console.log('Subtitles already loaded, skipping...');
                return;
            }
            
            // For dub episodes, don't load subtitles by default (audio is already in English)
            // Only load if subtitles are explicitly available and user wants them
            if (episodeType === 'dub' && subtitles.length === 0) {
                console.log('Dub episode - no subtitles needed');
                subtitlesLoaded = true;
                return;
            }
            
            // Remove any existing subtitle tracks to prevent duplicates
            const existingTracks = video.querySelectorAll('track');
            existingTracks.forEach(track => track.remove());
            
            // Load subtitle tracks
            subtitles.forEach((track, index) => {
                const trackEl = document.createElement('track');
                trackEl.kind = 'subtitles';
                trackEl.label = track.label;
                trackEl.srclang = 'en';
                trackEl.src = track.file; // Use direct subtitle URL
                
                // For sub episodes, enable first subtitle by default
                // For dub episodes, keep subtitles off by default
                if (episodeType === 'sub' && track.default && index === 0) {
                    trackEl.default = true;
                    currentSubtitle = index;
                }
                
                video.appendChild(trackEl);
            });
            
            // Enable first subtitle by default only for sub episodes
            if (episodeType === 'sub' && video.textTracks.length > 0 && currentSubtitle !== null) {
                video.textTracks[currentSubtitle].mode = 'showing';
            } else if (episodeType === 'dub') {
                // For dub episodes, keep all subtitles hidden by default
                Array.from(video.textTracks).forEach(track => {
                    track.mode = 'hidden';
                });
                currentSubtitle = null;
            }
            
            subtitlesLoaded = true;
            console.log('Subtitles loaded:', subtitles.length, 'tracks for', episodeType, 'episode');
        }

        // Add intro/outro highlights to progress bar
        function addProgressBarHighlights() {
            const timeRange = document.getElementById('time-range');
            if (!timeRange || !video.duration) return;

            // Remove existing highlights
            const existingHighlights = timeRange.querySelectorAll('.intro-highlight, .outro-highlight');
            existingHighlights.forEach(h => h.remove());

            const duration = video.duration;

            // Add intro highlight
            if (intro.end > 0 && intro.start < duration) {
                const introDiv = document.createElement('div');
                introDiv.className = 'intro-highlight';
                const startPercent = (intro.start / duration) * 100;
                const widthPercent = ((intro.end - intro.start) / duration) * 100;
                introDiv.style.left = startPercent + '%';
                introDiv.style.width = widthPercent + '%';
                timeRange.appendChild(introDiv);
            }

            // Add outro highlight
            if (outro.end > 0 && outro.start < duration) {
                const outroDiv = document.createElement('div');
                outroDiv.className = 'outro-highlight';
                const startPercent = (outro.start / duration) * 100;
                const widthPercent = ((outro.end - outro.start) / duration) * 100;
                outroDiv.style.left = startPercent + '%';
                outroDiv.style.width = widthPercent + '%';
                timeRange.appendChild(outroDiv);
            }
        }

        // Add highlights when video metadata is loaded
        video.addEventListener('loadedmetadata', addProgressBarHighlights);
        video.addEventListener('durationchange', addProgressBarHighlights);

        // Settings menu logic
        let menuState = 'main';
        
        function showMainMenu() {
            menuState = 'main';
            const qualityLabel = currentQuality === -1 ? 'Auto' : (hls?.levels[currentQuality]?.height + 'p' || 'Auto');
            const speedLabel = currentSpeed + 'x';
            const subLabel = subtitles.length === 0 ? 'None' : (currentSubtitle !== null ? subtitles[currentSubtitle]?.label : 'Off');
            
            
            let html = '';
            html += '<div class="menu-item" data-action="quality">';
            html += '<span>Quality</span>';
            html += '<span style="opacity: 0.7">' + qualityLabel + '</span>';
            html += '</div>';
            html += '<div class="menu-item" data-action="speed">';
            html += '<span>Playback Speed</span>';
            html += '<span style="opacity: 0.7">' + speedLabel + '</span>';
            html += '</div>';
            html += '<div class="menu-item" data-action="subtitle">';
            html += '<span>Subtitles</span>';
            html += '<span style="opacity: 0.7">' + subLabel + '</span>';
            html += '</div>';
            
            settingsMenu.innerHTML = html;
            
            // Add event listeners
            const menuItems = settingsMenu.querySelectorAll('.menu-item');
            
            menuItems.forEach(item => {
                const action = item.getAttribute('data-action');
                
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    if (action === 'quality') showQualityMenu();
                    else if (action === 'speed') showSpeedMenu();
                    else if (action === 'subtitle') showSubtitleMenu();
                });
            });
        }

        function showQualityMenu() {
            menuState = 'quality';
            if (!hls) {
                return;
            }
            
            
            let html = '<div class="menu-header" data-action="back">← Quality</div>';
            html += '<div class="menu-item' + (currentQuality === -1 ? ' active' : '') + '" data-quality="-1">Auto</div>';
            
            hls.levels.forEach((level, index) => {
                html += '<div class="menu-item' + (currentQuality === index ? ' active' : '') + '" data-quality="' + index + '">' + level.height + 'p</div>';
            });
            
            settingsMenu.innerHTML = html;
            
            // Add event listeners
            settingsMenu.querySelector('[data-action="back"]').addEventListener('click', () => {
                showMainMenu();
            });
            
            settingsMenu.querySelectorAll('[data-quality]').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const level = parseInt(item.getAttribute('data-quality'));
                    setQuality(level);
                });
            });
        }

        function showSpeedMenu() {
            menuState = 'speed';
            const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
            
            let html = '<div class="menu-header" data-action="back">← Playback Speed</div>';
            speeds.forEach(speed => {
                html += '<div class="menu-item' + (currentSpeed === speed ? ' active' : '') + '" data-speed="' + speed + '">' + speed + 'x</div>';
            });
            
            settingsMenu.innerHTML = html;
            
            // Add event listeners
            settingsMenu.querySelector('[data-action="back"]').addEventListener('click', showMainMenu);
            settingsMenu.querySelectorAll('[data-speed]').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const speed = parseFloat(item.getAttribute('data-speed'));
                    setSpeed(speed);
                });
            });
        }

        function showSubtitleMenu() {
            menuState = 'subtitle';
            
            let html = '<div class="menu-header" data-action="back">← Subtitles</div>';
            
            if (subtitles.length === 0) {
                const message = episodeType === 'dub' 
                    ? 'No subtitles (Dub audio)' 
                    : 'No subtitles available';
                html += '<div class="menu-item" style="opacity: 0.5; cursor: default;">' + message + '</div>';
            } else {
                html += '<div class="menu-item' + (currentSubtitle === null ? ' active' : '') + '" data-subtitle="null">Off</div>';
                
                subtitles.forEach((track, index) => {
                    html += '<div class="menu-item' + (currentSubtitle === index ? ' active' : '') + '" data-subtitle="' + index + '">' + track.label + '</div>';
                });
            }
            
            settingsMenu.innerHTML = html;
            
            // Add event listeners
            settingsMenu.querySelector('[data-action="back"]').addEventListener('click', showMainMenu);
            
            if (subtitles.length > 0) {
                settingsMenu.querySelectorAll('[data-subtitle]').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const subIndex = item.getAttribute('data-subtitle');
                        setSubtitle(subIndex === 'null' ? null : parseInt(subIndex));
                    });
                });
            }
        }

        function setQuality(level) {
            currentQuality = level;
            if (hls) {
                hls.currentLevel = level;
            }
            showMainMenu();
        }

        function setSpeed(speed) {
            currentSpeed = speed;
            video.playbackRate = speed;
            showMainMenu();
        }

        function setSubtitle(index) {
            currentSubtitle = index;
            
            // Update text tracks
            Array.from(video.textTracks).forEach((track, i) => {
                track.mode = i === index ? 'showing' : 'hidden';
            });
            
            // Update CC button state
            const ccButton = document.querySelector('media-captions-button');
            if (ccButton) {
                ccButton.setAttribute('aria-checked', index !== null ? 'true' : 'false');
            }
            
            showMainMenu();
        }

        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (settingsMenu.classList.contains('active')) {
                settingsMenu.classList.remove('active');
            } else {
                showMainMenu();
                settingsMenu.classList.add('active');
            }
        });

        document.addEventListener('click', (e) => {
            if (!settingsMenu.contains(e.target) && e.target !== settingsBtn && !settingsBtn.contains(e.target)) {
                settingsMenu.classList.remove('active');
            }
        });

        // Update seek button labels to show 10s - improved method
        function updateSeekButtonLabels() {
            const seekBackward = document.querySelector('media-seek-backward-button');
            const seekForward = document.querySelector('media-seek-forward-button');
            
            [seekBackward, seekForward].forEach(btn => {
                if (!btn) return;
                
                // Try to update via shadow DOM
                try {
                    const shadowRoot = btn.shadowRoot;
                    if (shadowRoot) {
                        const timeDisplay = shadowRoot.querySelector('[part*="time"]') || 
                                          shadowRoot.querySelector('span') ||
                                          shadowRoot.querySelector('[class*="time"]');
                        if (timeDisplay && timeDisplay.textContent.includes('30')) {
                            timeDisplay.textContent = timeDisplay.textContent.replace('30', '10');
                        }
                    }
                } catch (e) {
                }
            });
        }
        
        // Try multiple times to update seek buttons
        setTimeout(updateSeekButtonLabels, 500);
        setTimeout(updateSeekButtonLabels, 1000);
        setTimeout(updateSeekButtonLabels, 2000);

        // Skip intro/outro logic
        video.addEventListener('timeupdate', () => {
            const t = video.currentTime;
            
            if (intro.end > 0 && t >= intro.start && t < intro.end) {
                skipIntroBtn.classList.add('visible');
                skipIntroBtn.onclick = () => video.currentTime = intro.end;
            } else {
                skipIntroBtn.classList.remove('visible');
            }

            if (outro.end > 0 && t >= outro.start && t < outro.end) {
                skipOutroBtn.classList.add('visible');
                skipOutroBtn.onclick = () => video.currentTime = outro.end;
            } else {
                skipOutroBtn.classList.remove('visible');
            }
        });
    </script>
</body>
</html>
        `;

        return c.html(html);

    } catch (error) {
        console.error("Embed Error:", error.message);
        return c.text('Internal Server Error', 500);
    }
};

export default embedController;
