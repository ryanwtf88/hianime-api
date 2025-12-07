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

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Watch Anime</title>
    <link href="https://vjs.zencdn.net/8.5.2/video-js.css" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #000;
            overflow: hidden;
        }

        .video-container {
            width: 100%;
            height: 100%;
            position: relative;
        }

        .video-js {
            width: 100%;
            height: 100%;
        }

        /* Skip buttons */
        .skip-button {
            position: absolute;
            bottom: 80px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            font-size: 14px;
            display: none;
            align-items: center;
            gap: 8px;
            z-index: 100;
            transition: all 0.3s ease;
        }

        .skip-button.visible {
            display: flex;
        }

        .skip-button:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: scale(1.05);
        }

        #skip-outro {
            bottom: 120px;
        }

        /* Enhanced subtitle styling */
        .video-js .vjs-text-track-display {
            position: absolute;
            bottom: 80px !important;
        }

        .vjs-fullscreen .vjs-text-track-display {
            bottom: 100px !important;
        }

        video::cue {
            background-color: rgba(0, 0, 0, 0.8);
            color: #ffffff;
            font-size: 16px;
            font-family: Arial, sans-serif;
            font-weight: 400;
            text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.9);
            line-height: 1.4;
            padding: 4px 8px;
            border-radius: 3px;
        }

        .vjs-fullscreen video::cue {
            font-size: 24px;
            padding: 6px 10px;
        }
    </style>
</head>
<body>
    <div class="video-container">
        <video id="video-player" class="video-js vjs-default-skin" controls preload="auto" crossorigin="anonymous">
        </video>
        
        <div id="skip-intro" class="skip-button">
            Skip Intro ⏩
        </div>
        <div id="skip-outro" class="skip-button">
            Skip Outro ⏩
        </div>
    </div>

    <script src="https://vjs.zencdn.net/8.5.2/video.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>

    <script>
        const videoUrl = '${m3u8Url}';
        const subtitles = ${JSON.stringify(tracks.filter(t => t.kind === 'captions'))};
        const intro = ${JSON.stringify(intro || { start: 0, end: 0 })};
        const outro = ${JSON.stringify(outro || { start: 0, end: 0 })};

        if (!videoUrl) {
            document.body.innerHTML = '<p style="color: white; font-size: 18px;">Error: No video URL provided.</p>';
            throw new Error("Video URL is required");
        }

        const player = videojs('video-player', {
            autoplay: true,
            muted: false,
            controls: true,
            preload: 'auto',
            playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
            fluid: true,
            responsive: true,
            crossOrigin: 'anonymous',
        });

        // HLS.js for better compatibility
        if (Hls.isSupported()) {
            const hls = new Hls({
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

            hls.loadSource(videoUrl);
            hls.attachMedia(player.tech().el());

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error("HLS Error:", data);
                if (data.fatal) {
                    switch(data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.log("Network error, attempting to recover...");
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log("Media error, attempting to recover...");
                            hls.recoverMediaError();
                            break;
                        default:
                            console.log("Fatal error, destroying HLS instance");
                            hls.destroy();
                            break;
                    }
                }
            });

            // Quality selector
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log("HLS manifest parsed, levels available:", hls.levels.length);
                loadSubtitles();
            });

            // Store hls instance for quality control
            player.hls = hls;
        } else if (player.tech().el().canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            player.src({
                src: videoUrl,
                type: 'application/x-mpegURL'
            });
            player.ready(() => {
                loadSubtitles();
            });
        } else {
            alert('Your browser does not support HLS playback.');
        }

        // Load subtitles
        function loadSubtitles() {
            subtitles.forEach((track, index) => {
                player.addRemoteTextTrack({
                    kind: 'subtitles',
                    label: track.label,
                    srclang: 'en',
                    src: track.file,
                    default: track.default && index === 0
                }, false);
            });

            // Enable first subtitle by default if available
            if (subtitles.length > 0) {
                const tracks = player.textTracks();
                for (let i = 0; i < tracks.length; i++) {
                    if (i === 0) {
                        tracks[i].mode = 'showing';
                    } else {
                        tracks[i].mode = 'disabled';
                    }
                }
            }
        }

        // Skip intro/outro functionality
        const skipIntroBtn = document.getElementById('skip-intro');
        const skipOutroBtn = document.getElementById('skip-outro');

        player.on('timeupdate', () => {
            const currentTime = player.currentTime();

            // Check intro
            if (intro.end > 0 && currentTime >= intro.start && currentTime < intro.end) {
                skipIntroBtn.classList.add('visible');
            } else {
                skipIntroBtn.classList.remove('visible');
            }

            // Check outro
            if (outro.end > 0 && currentTime >= outro.start && currentTime < outro.end) {
                skipOutroBtn.classList.add('visible');
            } else {
                skipOutroBtn.classList.remove('visible');
            }
        });

        skipIntroBtn.addEventListener('click', () => {
            player.currentTime(intro.end);
            skipIntroBtn.classList.remove('visible');
        });

        skipOutroBtn.addEventListener('click', () => {
            player.currentTime(outro.end);
            skipOutroBtn.classList.remove('visible');
        });

        // Error handling
        player.on('error', (error) => {
            console.error('Video.js error:', error);
            const errorDisplay = player.error();
            if (errorDisplay) {
                console.error('Error details:', errorDisplay);
            }
        });

        // Log when video is ready
        player.ready(() => {
            console.log('Player is ready!');
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
