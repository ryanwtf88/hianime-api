import { load } from 'cheerio';

export const extractServers = (html) => {
  if (!html || typeof html !== 'string') {
    throw new Error('Invalid HTML input');
  }

  try {
    const $ = load(html);

    const episodeText = $('.server-notice strong b').text().trim();
    const episodeParts = episodeText.split(' ');
    const episode = episodeParts.at(-1);

    const extractServerList = (block) => {
      const servers = [];
      const serverItems = $(block).find('.server-item');
      
      serverItems.each((i, element) => {
        try {
          const serverType = $(element).attr('data-type');
          const serverId = $(element).attr('data-id');
          const serverName = $(element).find('a').text().trim();
          const serverIndex = $(element).attr('data-server-id');

          // Only add server if all required data is present
          if (serverType && serverId && serverName) {
            servers.push({
              index: serverIndex ? Number(serverIndex) : null,
              type: serverType,
              id: serverId,
              name: serverName,
            });
          } else {
            console.warn('Skipping incomplete server data:', {
              serverType,
              serverId,
              serverName,
            });
          }
        } catch (err) {
          console.error('Error extracting server item:', err.message);
        }
      });

      // Add HD-4 fallback server
      servers.push({
        index: null,
        type: block.includes('sub') ? 'sub' : 'dub',
        id: null,
        name: 'HD-4',
      });

      return servers;
    };

    const subServers = extractServerList('.servers-sub .ps__-list');
    const dubServers = extractServerList('.servers-dub .ps__-list');

    return {
      episode: episode && !isNaN(episode) ? Number(episode) : null,
      sub: subServers,
      dub: dubServers,
    };
  } catch (error) {
    console.error('Error in extractServers:', error.message);
    throw new Error('Failed to parse server data: ' + error.message);
  }
};
