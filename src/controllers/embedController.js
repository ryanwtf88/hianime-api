import { validationError } from '../utils/errors.js';
import config from '../config/config.js';
import { load } from 'cheerio';

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
        // Get servers list
        const serversUrl = `${config.baseurl}/ajax/v2/episode/servers?episodeId=${episodeId}`;
        const serversResponse = await fetch(serversUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!serversResponse.ok) {
            throw new Error(`Failed to fetch servers: ${serversResponse.status}`);
        }

        const serversData = await serversResponse.json();

        if (!serversData.status || !serversData.html) {
            throw new Error('Invalid servers response');
        }

        // Parse servers HTML to get server ID
        const $ = load(serversData.html);
        const serverItem = $(`.server-item[data-type="${type}"]`).first();

        if (!serverItem.length) {
            throw new Error(`No ${type} server found`);
        }

        const serverId = serverItem.attr('data-id');

        if (!serverId) {
            throw new Error('Server ID not found');
        }

        // Get player iframe
        const sourcesUrl = `${config.baseurl}/ajax/v2/episode/sources?id=${serverId}`;
        const sourcesResponse = await fetch(sourcesUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!sourcesResponse.ok) {
            throw new Error(`Failed to fetch sources: ${sourcesResponse.status}`);
        }

        const sourcesData = await sourcesResponse.json();

        if (!sourcesData.link) {
            throw new Error('Player link not found');
        }

        // Create embed HTML with iframe
        const embedHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Anime Player</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        background: #000;
                        overflow: hidden;
                    }
                    iframe {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        border: none;
                    }
                </style>
            </head>
            <body>
                <iframe src="${sourcesData.link}" allowfullscreen></iframe>
            </body>
            </html>
        `;

        return c.html(embedHtml);

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
                    <h1>Error</h1>
                    <p>Failed to load video player</p>
                    <p style="font-size: 14px; margin-top: 20px;">Episode ID: ${episodeId}</p>
                    <p style="font-size: 12px; color: #ff5555; margin-top: 10px;">${error.message}</p>
                </div>
            </body>
            </html>
        `;

        return c.html(errorHtml, 400);
    }
};

export default embedController;
