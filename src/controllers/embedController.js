import { getServers } from './serversController.js';
import { extractStream } from '../extractor/extractStream.js';
import { fail } from '../utils/response.js';
import { htmlTemplate, cssTemplate } from './embedTemplates.js';

export const embedController = async (c) => {
  try {
    let { id, server, type } = c.req.param();

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

    // Server normalization for compatibility
    const sn = (s) => (['HD-1', 'HD-3'].includes(s) ? 'HD-2' : s);
    const ns = sn(server);

    // 1. Direct match by name (Priority)
    selectedServer = servers[type].find((s) => s.name.toUpperCase() === ns);

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

    const inject = (content, placeholder, value) => {
      if (!content) return '';
      return content.split(placeholder).join(value);
    };

    // Use inlined templates for Cloudflare Workers compatibility
    let htmlContent = htmlTemplate;
    htmlContent = inject(htmlContent, '{{STYLES}}', cssTemplate);
    htmlContent = inject(htmlContent, '{{M3U8_URL}}', m3u8Url);
    htmlContent = inject(
      htmlContent,
      '{{SUBTITLES_JSON}}',
      JSON.stringify((tracks || []).filter((t) => t && t.label && t.file))
    );
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
    htmlContent = inject(htmlContent, '{{AUTOPLAY}}', c.req.query('autoplay') === 'true');
    htmlContent = inject(htmlContent, '{{SKIP_INTRO}}', c.req.query('skipIntro') === 'true');
    htmlContent = inject(htmlContent, '{{EPISODE_TITLE}}', episodeTitle);
    htmlContent = inject(htmlContent, '{{MEDIA_ID}}', id || 'unknown');

    return c.html(htmlContent);
  } catch (_e) {
    console.error('Embed Controller Error');
    const statusCode = _e.statusCode || 500;
    return fail(c, _e.message || 'Internal Server Error', statusCode, _e.details);
  }
};

export default embedController;
