import { getServers } from './serversController.js';
import { extractStream } from '../extractor/extractStream.js';
import { fail } from '../utils/response.js';
import fs from 'fs';
import path from 'path';

/**
 * embedController.js
 * Purpose: Handles the video player embed request, processes stream extraction,
 *          and serves the player HTML with injected configuration.
 * Interaction: Receives request, calls extractStream, loads external HTML/CSS,
 *              injects data, and returns the final HTML response.
 */

// SECTION: Functionality
export const embedController = async (c) => {
  try {
    let { id, server, type } = c.req.param();

    // SECTION: Icons Definition
    const icons = {
      back: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
      check:
        '<svg viewBox="0 0 16 16" fill="#fff"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>',
      chevron:
        '<svg viewBox="0 0 16 16" fill="#fff"><path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>',
      gear: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M204,145l-25-14c0.8-3.6,1.2-7.3,1-11c0.2-3.7-0.2-7.4-1-11l25-14c2.2-1.6,3.1-4.5,2-7l-16-26c-1.2-2.1-3.8-2.9-6-2l-25,14c-6-4.2-12.3-7.9-19-11V35c0.2-2.6-1.8-4.8-4.4-5c-0.2,0-0.4,0-0.6,0h-30c-2.6-0.2-4.8,1.8-5,4.4c0,0.2,0,0.4,0,0.6v28c-6.7,3.1-13,6.7-19,11L56,60c-2.2-0.9-4.8-0.1-6,2L35,88c-1.6,2.2-1.3,5.3,0.9,6.9c0,0,0.1,0,0.1,0.1l25,14c-0.8,3.6-1.2,7.3-1,11c-0.2,3.7,0.2,7.4,1,11l-25,14c-2.2,1.6-3.1,4.5-2,7l16,26c1.2,2.1,3.8,2.9,6,2l25-14c5.7,4.6,12.2,8.3,19,11v28c-0.2,2.6,1.8,4.8,4.4,5c0.2,0,0.4,0,0.6,0h30c2.6,0.2,4.8-1.8,5-4.4c0-0.2,0-0.4,0-0.6v-28c7-2.3,13.5-6,19-11l25,14c2.5,1.3,5.6,0.4,7-2l15-26C206.7,149.4,206,146.7,204,145z M120,149.9c-16.5,0-30-13.4-30-30s13.4-30,30-30s30,13.4,30,30c0.3,16.3-12.6,29.7-28.9,30C120.7,149.9,120.4,149.9,120,149.9z"/></svg>',
      quality:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M55,200H35c-3,0-5-2-5-4c0,0,0,0,0-1v-30c0-3,2-5,4-5c0,0,0,0,1,0h20c3,0,5,2,5,4c0,0,0,0,0,1v30C60,198,58,200,55,200L55,200z M110,195v-70c0-3-2-5-4-5c0,0,0,0-1,0H85c-3,0-5,2-5,4c0,0,0,0,0,1v70c0,3,2,5,4,5c0,0,0,0,1,0h20C108,200,110,198,110,195L110,195z M160,195V85c0-3-2-5-4-5c0,0,0,0-1,0h-20c-3,0-5,2-5,4c0,0,0,0,0,1v110c0,3,2,5,4,5c0,0,0,0,1,0h20C158,200,160,198,160,195L160,195z M210,195V45c0-3-2-5-4-5c0,0,0,0-1,0h-20c-3,0-5,2-5,4c0,0,0,0,0,1v150c0,3,2,5,4,5c0,0,0,0,1,0h20C208,200,210,198,210,195L210,195z"/></svg>',
      speed:
        '<svg viewBox="0 0 16 16" fill="#fff"><path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2zM3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.389.389 0 0 0-.029-.518z"/><path fill-rule="evenodd" d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.945 11.945 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0z"/></svg>',
      ratio:
        '<svg viewBox="0 0 16 16" fill="#fff"><path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/><path d="M2 4.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H3v2.5a.5.5 0 0 1-1 0v-3zm12 7a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H13V8.5a.5.5 0 0 1 1 0v3z"/></svg>',
      cc: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M215,40H25c-2.7,0-5,2.2-5,5v150c0,2.7,2.2,5,5,5h190c2.7,0,5-2.2,5-5V45C220,42.2,217.8,40,215,40z M108.1,137.7c0.7-0.7,1.5-1.5,2.4-2.3l6.6,7.8c-2.2,2.4-5,4.4-8,5.8c-8,3.5-17.3,2.4-24.3-2.9c-3.9-3.6-5.9-8.7-5.5-14v-25.6c0-2.7,0.5-5.3,1.5-7.8c0.9-2.2,2.4-4.3,4.2-5.9c5.7-4.5,13.2-6.2,20.3-4.6c3.3,0.5,6.3,2,8.7,4.3c1.3,1.3,2.5,2.6,3.5,4.2l-7.1,6.9c-2.4-3.7-6.5-5.9-10.9-5.9c-2.4-0.2-4.8,0.7-6.6,2.3c-1.7,1.7-2.5,4.1-2.4,6.5v25.6C90.4,141.7,102,143.5,108.1,137.7z M152.9,137.7c0.7-0.7,1.5-1.5,2.4-2.3l6.6,7.8c-2.2,2.4-5,4.4-8,5.8c-8,3.5-17.3,2.4-24.3-2.9c-3.9-3.6-5.9-8.7-5.5-14v-25.6c0-2.7,0.5-5.3,1.5-7.8c0.9-2.2,2.4-4.3,4.2-5.9c5.7-4.5,13.2-6.2,20.3-4.6c3.3,0.5,6.3,2,8.7,4.3c1.3,1.3,2.5,2.6,3.5,4.2l-7.1,6.9c-2.4-3.7-6.5-5.9-10.9-5.9c-2.4-0.2-4.8,0.7-6.6,2.3c-1.7,1.7-2.5,4.1-2.4,6.5v25.6C135.2,141.7,146.8,143.5,152.9,137.7z"/></svg>',
      pipOff:
        '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#fff"><path fill-rule="evenodd" clip-rule="evenodd" d="M20 5.75V9.75H22V4.78C22 4.21116 21.5389 3.75 20.97 3.75H2.03C1.46116 3.75 1 4.21113 1 4.78V17.72C1 18.2889 1.46119 18.75 2.03 18.75H12V16.75H3V5.75H20ZM14 13.25C14 12.6977 14.4477 12.25 15 12.25H22C22.5523 12.25 23 12.6977 23 13.25V19.25C23 19.8023 22.5523 20.25 22 20.25H15C14.4477 20.25 14 19.8023 14 19.25V13.25ZM10 9.25L8.20711 11.0429L10.7071 13.5429L9.29289 14.9571L6.79289 12.4571L5 14.25V9.25H10Z"/></svg>',
      pipOn:
        '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#3b82f6"><path fill-rule="evenodd" clip-rule="evenodd" d="M20 5.125V9.125H22V4.155C22 3.58616 21.5389 3.125 20.97 3.125H2.03C1.46116 3.125 1 3.58613 1 4.155V17.095C1 17.6639 1.46119 18.125 2.03 18.125H12V16.125H3V5.125H20ZM14 11.875C14 11.3227 14.4477 10.875 15 10.875H22C22.5523 10.875 23 11.3227 23 11.875V17.875C23 18.4273 22.5523 18.875 22 18.875H15C14.4477 18.875 14 18.4273 14 17.875V11.875ZM6 12.375L7.79289 10.5821L5.29288 8.0821L6.7071 6.66788L9.20711 9.16789L11 7.375V12.375H6Z"/></svg>',
      volume0:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M116.4,42.8v154.5c0,2.8-1.7,3.6-3.8,1.7l-54.1-48.1H28.9c-2.8,0-5.2-2.3-5.2-5.2V94.2c0-2.8,2.3-5.2,5.2-5.2h29.6l54.1-48.1C114.6,39.1,116.4,39.9,116.4,42.8z M212.3,96.4l-14.6-14.6l-23.6,23.6l-23.6-23.6l-14.6,14.6l23.6,23.6l-23.6,23.6l14.6,14.6l23.6-23.6l23.6,23.6l14.6-14.6L188.7,120L212.3,96.4z"/></svg>',
      volume50:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M116.4,42.8v154.5c0,2.8-1.7,3.6-3.8,1.7l-54.1-48.1H28.9c-2.8,0-5.2-2.3-5.2-5.2V94.2c0-2.8,2.3-5.2,5.2-5.2h29.6l54.1-48.1C114.7,39.1,116.4,39.9,116.4,42.8z M178.2,120c0-22.7-18.5-41.2-41.2-41.2v20.6c11.4,0,20.6,9.2,20.6,20.6c0,11.4-9.2,20.6-20.6,20.6v20.6C159.8,161.2,178.2,142.7,178.2,120z"/></svg>',
      volume100:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M116.5,42.8v154.4c0,2.8-1.7,3.6-3.8,1.7l-54.1-48H29c-2.8,0-5.2-2.3-5.2-5.2V94.3c0-2.8,2.3-5.2,5.2-5.2h29.6l54.1-48C114.8,39.2,116.5,39.9,116.5,42.8z"/><path d="M136.2,160v-20c11.1,0,20-8.9,20-20s-8.9-20-20-20V80c22.1,0,40,17.9,40,40S158.3,160,136.2,160z"/><path d="M216.2,120c0-44.2-35.8-80-80-80v20c33.1,0,60,26.9,60,60s-26.9,60-60,60v20C180.4,199.9,216.1,164.1,216.2,120z"/></svg>',
      rewind:
        '<svg fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false"><path d="M113.2,131.078a21.589,21.589 0,0,0-17.7-10.6,21.589,21.589 0,0,0-17.7,10.6,44.769,44.769 0,0,0,0,46.3,21.589,21.589 0,0,0,17.7,10.6,21.589,21.589 0,0,0,17.7-10.6,44.769,44.769 0,0,0,0-46.3Zm-17.7,47.2c-7.8,0-14.4-11-14.4-24.1s6.6-24.1,14.4-24.1,14.4,11,14.4,24.1S103.4,178.278,95.5,178.278Zm-43.4,9.7v-51l-4.8,4.8-6.8-6.8,13-13a4.8,4.8 0,0,1,8.2,3.4v62.7l-9.6-.1Zm162-130.2v125.3a4.867,4.867 0,0,1-4.8,4.8H146.6v-19.3h48.2v-96.4H79.1v19.3c0,5.3-3.6,7.2-8,4.3l-41.8-27.9a6.013,6.013 0,0,1-2.7-8,5.887,5.887 0,0,1,2.7-2.7l41.8-27.9c4.4-2.9,8-1,8,4.3v19.3H209.2A4.974,4.974 0,0,1,214.1,57.778Z"/></svg>',
      forward:
        '<svg fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false"> <path d="M146.8,131.078a21.589,21.589 0,0,1,17.7-10.6,21.589,21.589 0,0,1,17.7,10.6,44.769,44.769 0,0,1,0,46.3,21.589,21.589 0,0,1-17.7,10.6,21.589,21.589 0,0,1-17.7-10.6,44.769,44.769 0,0,1,0-46.3Zm17.7,47.2c7.8,0,14.4-11,14.4-24.1s-6.6-24.1-14.4-24.1-14.4,11-14.4,24.1S156.6,178.278,164.5,178.278ZM128.1,187.978v-51l-4.8,4.8-6.8-6.8,13-13a4.8,4.8 0,0,1,8.2,3.4v62.7l-9.6-.1ZM25.9,57.778v125.3a4.867,4.867 0,0,0,4.8,4.8h62.7v-19.3H45.2v-96.4h125.3v19.3c0,5.3,3.6,7.2,8,4.3l41.8-27.9a6.013,6.013 0,0,0,2.7-8,5.887,5.887 0,0,0-2.7-2.7l-41.8-27.9c-4.4-2.9-8-1-8,4.3v19.3H30.8A4.974,4.974 0,0,0,25.9,57.778Z"/> </svg>',
      fullscreen:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M96.3,186.1c1.9,1.9,1.3,4-1.4,4.4l-50.6,8.4c-1.8,0.5-3.7-0.6-4.2-2.4c-0.2-0.6-0.2-1.2,0-1.7l8.4-50.6c0.4-2.7,2.4-3.4,4.4-1.4l14.5,14.5l28.2-28.2l14.3,14.3l-28.2,28.2L96.3,186.1z M195.8,39.1l-50.6,8.4c-2.7,0.4-3.4,2.4-1.4,4.4l14.5,14.5l-28.2,28.2l14.3,14.3l28.2-28.2l14.5,14.5c1.9,1.9,4,1.3,4.4-1.4l8.4-50.6c0.5-1.8-0.6-3.6-2.4-4.2C197,39,196.4,39,195.8,39.1L195.8,39.1z"/></svg>',
      fullscreenNot:
        '<svg fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false"><path d="M109.2,134.9l-8.4,50.1c-0.4,2.7-2.4,3.3-4.4,1.4L82,172l-27.9,27.9l-14.2-14.2l27.9-27.9l-14.4-14.4c-1.9-1.9-1.3-3.9,1.4-4.4l50.1-8.4c1.8-0.5,3.6,0.6,4.1,2.4C109.4,133.7,109.4,134.3,109.2,134.9L109.2,134.9z M172.1,82.1L200,54.2L185.8,40l-27.9,27.9l-14.4-14.4c-1.9-1.9-3.9-1.3-4.4,1.4l-8.4,50.1c-0.5,1.8,0.6,3.6,2.4,4.1c0.5,0.2,1.2,0.2,1.7,0l50.1-8.4c2.7-0.4,3.3-2.4,1.4-4.4L172.1,82.1z"/></svg>',
      play: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M62.8,199.5c-1,0.8-2.4,0.6-3.3-0.4c-0.4-0.5-0.6-1.1-0.5-1.8V42.6c-0.2-1.3,0.7-2.4,1.9-2.6c0.7-0.1,1.3,0.1,1.9,0.4l154.7,77.7c2.1,1.1,2.1,2.8,0,3.8L62.8,199.5z"/></svg>',
      pause:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M100,194.9c0.2,2.6-1.8,4.8-4.4,5c-0.2,0-0.4,0-0.6,0H65c-2.6,0.2-4.8-1.8-5-4.4c0-0.2,0-0.4,0-0.6V45c-0.2-2.6,1.8-4.8,4.4-5c0.2,0,0.4,0,0.6,0h30c2.6-0.2,4.8,1.8,5,4.4c0,0.2,0,0.4,0,0.6V194.9z M180,45.1c0.2-2.6-1.8-4.8-4.4-5c-0.2,0-0.4,0-0.6,0h-30c-2.6-0.2-4.8,1.8-5,4.4c0,0.2,0,0.4,0,0.6V195c-0.2,2.6,1.8,4.8,4.4,5c0.2,0,0.4,0,0.6,0h30c2.6,0.2,4.8-1.8,5-4.4c0-0.2,0-0.4,0-0.6V45.1z"/></svg>',
      buffer:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M120,186.667a66.667,66.667,0,0,1,0-133.333V40a80,80,0,1,0,80,80H186.667A66.846,66.846,0,0,1,120,186.667Z"/></svg>',
      replay:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M120,41.9v-20c0-5-4-8-8-4l-44,28a5.865,5.865,0,0,0-3.3,7.6A5.943,5.943,0,0,0,68,56.8l43,29c5,4,9,1,9-4v-20a60,60,0,1,1-60,60H40a80,80,0,1,0,80-79.9Z"/></svg>',
    };

    if (!id) id = c.req.query('id');
    if (!server) server = c.req.query('server');
    if (!type) type = c.req.query('type');

    if (!id) return c.text('ID is required', 400);

    server = server ? server.toUpperCase() : 'HD-2';
    type = (type || 'sub').toLowerCase();

    // SECTION: Server Selection Logic
    // This logic finds the server in the actual list returned by the API
    // matching the requested name (HD-1, HD-2, RAW, etc.)
    const servers = await getServers(id);
    if (!servers[type]) return c.text(`Type ${type} not found`, 404);

    let selectedServer = null;

    // 1. Direct match by name (Priority)
    selectedServer = servers[type].find((s) => s.name.toUpperCase() === server);

    // 2. Handle specific MegaCloud mapping index 1 or 4 if server is MEGACLOUD or S-1 (Legacy)
    if (!selectedServer && (server === 'MEGACLOUD' || server === 'S-1')) {
      selectedServer =
        servers[type].find((s) => s.index === 1) || servers[type].find((s) => s.index === 4);
    }

    // 3. Handle legacy mapping S-1 -> HD-1, etc. (Generic)
    if (!selectedServer && server.startsWith('S-')) {
      const index = server.replace('S-', '');
      const mappedName = `HD-${index}`;
      selectedServer = servers[type].find((s) => s.name.toUpperCase() === mappedName);
    }

    // 4. Last resort fallback for RAW type if generic "RAW" was requested
    if (!selectedServer && server === 'RAW' && servers[type].length > 0) {
      selectedServer = servers[type][0];
    }

    if (!selectedServer)
      return c.text(`Server ${server} (${type}) not found for this episode`, 404);

    // SECTION: Stream Extraction
    let stream = null;
    try {
      stream = await extractStream({ selectedServer, id });
    } catch (extractErr) {
      console.error('Extraction Error:', extractErr.message);
      return fail(c, 'Failed to extract stream from server', 500, extractErr.message);
    }

    if (!stream || !stream.link || !stream.link.file) {
      return fail(c, 'No stream links found for this server', 404);
    }

    const m3u8Url = stream.link.file;
    const tracks = stream.tracks || [];
    const intro = stream.intro || {};
    const outro = stream.outro || {};

    // Extract episode title
    let episodeTitle = 'Episode';
    if (servers && servers.episode) {
      episodeTitle = `Episode ${servers.episode}`;
    } else {
      // Fallback logic
      try {
        const idPath = id.split('?')[0];
        const idParts = idPath.split('-');
        const episodeNum = idParts[idParts.length - 1];

        if (episodeNum && !isNaN(episodeNum)) {
          episodeTitle = `Episode ${episodeNum}`;
        } else {
          const epMatch = idPath.match(/episode-(\d+)/);
          if (epMatch) {
            episodeTitle = `Episode ${epMatch[1]}`;
          }
        }
      } catch {
        console.log('Could not extract episode number from ID');
      }
    }

    // SECTION: HTML Preparation
    // Helper for global replacement
    const inject = (content, placeholder, value) => {
      if (!content) return '';
      return content.split(placeholder).join(value);
    };

    // Read templates
    let htmlTemplate = '';
    let cssTemplate = '';
    try {
      htmlTemplate = fs.readFileSync(
        path.join(process.cwd(), 'src/controllers/embedCollector.html'),
        'utf8'
      );
      cssTemplate = fs.readFileSync(
        path.join(process.cwd(), 'src/controllers/embedCollector.css'),
        'utf8'
      );
    } catch (err) {
      console.error('Error reading embed templates:', err);
      return fail(c, 'Failed to load player templates', 500);
    }

    // Inject Styles
    let htmlContent = htmlTemplate;
    htmlContent = inject(htmlContent, '{{STYLES}}', cssTemplate);

    // Inject Icons
    htmlContent = inject(htmlContent, '{{ICONS_BUFFER}}', icons.buffer);
    htmlContent = inject(htmlContent, '{{ICONS_PLAY}}', icons.play);
    htmlContent = inject(htmlContent, '{{ICONS_REWIND}}', icons.rewind);
    htmlContent = inject(htmlContent, '{{ICONS_FORWARD}}', icons.forward);
    htmlContent = inject(htmlContent, '{{ICONS_VOLUME100}}', icons.volume100);
    htmlContent = inject(htmlContent, '{{ICONS_GEAR}}', icons.gear);
    htmlContent = inject(htmlContent, '{{ICONS_PIPOFF}}', icons.pipOff);
    htmlContent = inject(htmlContent, '{{ICONS_FULLSCREEN}}', icons.fullscreen);
    htmlContent = inject(htmlContent, '{{ICONS_BACK}}', icons.back);

    // Generate Client ID
    const clientId =
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Inject Data & Configuration
    htmlContent = inject(htmlContent, '{{ICONS_JSON}}', JSON.stringify(icons));
    htmlContent = inject(
      htmlContent,
      '{{INTRO_JSON}}',
      JSON.stringify(intro || { start: 0, end: 0 })
    );
    htmlContent = inject(
      htmlContent,
      '{{OUTRO_JSON}}',
      JSON.stringify(outro || { start: 0, end: 0 })
    );
    htmlContent = inject(
      htmlContent,
      '{{SUBTITLES_JSON}}',
      JSON.stringify((tracks || []).filter((t) => t && t.label && t.file))
    );
    htmlContent = inject(htmlContent, '{{AUTOPLAY}}', c.req.query('autoplay') === 'true');
    htmlContent = inject(htmlContent, '{{SKIP_INTRO}}', c.req.query('skipIntro') === 'true');
    htmlContent = inject(htmlContent, '{{M3U8_URL}}', m3u8Url);
    htmlContent = inject(htmlContent, '{{EPISODE_TITLE}}', episodeTitle);
    // Add metadata placeholders to avoid nulls
    htmlContent = inject(htmlContent, '{{MEDIA_ID}}', id || 'unknown');
    htmlContent = inject(htmlContent, '{{CLIENT_ID}}', clientId);

    return c.html(htmlContent);
  } catch (_e) {
    console.error('Embed Controller Error');
    // If it's a validation error, it will have statusCode
    const statusCode = _e.statusCode || 500;
    return fail(c, _e.message || 'Internal Server Error', statusCode, _e.details);
  }
};

export default embedController;
