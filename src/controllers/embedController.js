import { validationError } from '../utils/errors.js';
import axios from 'axios';
import config from '../config/config.js';

const embedController = async (c) => {
    const episodeId = c.req.param('episodeId');
    const type = c.req.query('type') || 'sub';

    if (!episodeId) {
        throw new validationError('Episode ID is required');
    }

    if (!['sub', 'dub'].includes(type.toLowerCase())) {
        throw new validationError('Type must be either "sub" or "dub"');
    }

    try {
        const url = `${config.baseurl}/watch?ep=${episodeId}`;
        console.log(`[Embed] Fetching hianime.to page: ${url}`);

        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': config.baseurl,
            'Origin': config.baseurl
        };

        const response = await axios.get(url, {
            headers,
            timeout: 15000,
            maxRedirects: 5
        });

        let html = response.data;

        html = html.replace(/src="\\/\\//g, 'src="https://');
            html = html.replace(/href="\\/\\//g, 'href="https://');
                html = html.replace(/src="\\/ / g, `src="${config.baseurl}/`);
        html = html.replace(/href="\\/ / g, `href="${config.baseurl}/`);

        const embedEnhancements = `
            <style id="embed-custom-styles">
                header, footer, nav, .header, .footer, .navigation,
                .site-header, .site-footer, .menu, .sidebar,
                .breadcrumb, .related, .recommendations,
                .comments, .social, .share, .episode-list,
                [class*="banner"], [class*="ad-"], [id*="ad-"],
                [class*="advertisement"], iframe[src*="ads"],
                .film-stats, .film-buttons, .film-info,
                .block_area:not(:has(#player-wrapper)),
                .block_area-content:not(:has(#player)),
                .container:not(:has(#player-wrapper)),
                .ani_detail-stage, .prebreadcrumb,
                #header, #footer, #sidebar,
                .deslide-wrap, .deslide-item,
                .film-description, .film-stats-wrap {
                    display: none !important;
                }
                
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow: hidden !important;
                    background: #000 !important;
                }
                
                #wrapper, #main-wrapper, .container,
                #player-wrapper, #player-container,
                #iframe-embed, .player-frame {
                    width: 100vw !important;
                    height: 100vh !important;
                    max-width: 100vw !important;
                    max-height: 100vh !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    z-index: 9999 !important;
                }
                
                iframe {
                    width: 100% !important;
                    height: 100% !important;
                    border: none !important;
                }
            </style>
            
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    const adSelectors = [
                        '[class*="ad-"]', '[id*="ad-"]',
                        '[class*="banner"]', '[class*="advertisement"]',
                        'header', 'footer', 'nav', '.sidebar',
                        '.comments', '.related', '.recommendations',
                        '.film-description', '.film-stats-wrap'
                    ];
                    
                    adSelectors.forEach(selector => {
                        document.querySelectorAll(selector).forEach(el => {
                            if (!el.closest('#player-wrapper') && !el.closest('#iframe-embed')) {
                                el.remove();
                            }
                        });
                    });
                    
                    const player = document.querySelector('#player-wrapper') || 
                                  document.querySelector('#iframe-embed') ||
                                  document.querySelector('iframe[src*="embed"]');
                    
                    if (player) {
                        document.body.innerHTML = '';
                        document.body.appendChild(player);
                        player.style.cssText = 'width: 100vw !important; height: 100vh !important; position: fixed !important; top: 0 !important; left: 0 !important;';
                    }
                });
            </script>
        `;

        html = html.replace('</head>', `${embedEnhancements}</head>`);

        return c.html(html);

    } catch (error) {
        console.error('[Embed] Error:', error.message);

        const errorHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Error</title>
                <style>
                    body { 
                        background: #000; 
                        color: #fff; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        height: 100vh; 
                        margin: 0; 
                        font-family: sans-serif; 
                    }
                    .error { 
                        text-align: center; 
                        padding: 40px; 
                    }
                    h1 { 
                        font-size: 48px; 
                        margin-bottom: 20px; 
                    }
                    p { 
                        font-size: 18px; 
                        opacity: 0.8; 
                    }
                </style>
            </head>
            <body>
                <div class="error">
                    <h1>⚠️ Error</h1>
                    <p>Failed to load video player</p>
                    <p style="font-size: 14px; margin-top: 20px;">Episode ID: ${episodeId}</p>
                </div>
            </body>
            </html>
        `;

        return c.html(errorHtml, 400);
    }
};

export default embedController;
