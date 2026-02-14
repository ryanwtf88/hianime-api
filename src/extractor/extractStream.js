import { megacloud } from '../parsers/megacloud.js';
import config from '../config/config.js';
import { getServers } from '../controllers/serversController.js';

export const extractStream = async ({ selectedServer, id }) => {
  const streamingLink = await megacloud({ selectedServer, id });

  if (streamingLink && streamingLink.link && streamingLink.link.file) {
    const directUrl = streamingLink.link.file;
    const encodedUrl = encodeURIComponent(directUrl);
    const encodedReferer = encodeURIComponent('https://megacloud.tv');
    const proxiedUrl = `${config.proxyUrl}/?url=${encodedUrl}&referer=${encodedReferer}`;

    streamingLink.link.directUrl = directUrl;
    streamingLink.link.file = proxiedUrl;
    streamingLink.link.proxyUrl = proxiedUrl;

    if (
      selectedServer.type === 'dub' &&
      (!streamingLink.tracks ||
        streamingLink.tracks.filter((t) => t.kind === 'captions').length === 0)
    ) {
      try {
        console.log('DUB episode has no subtitles, attempting to fetch from SUB version...');
        const allServers = await getServers(id);

        const subServer = allServers.sub.find(
          (s) => s.name === selectedServer.name || s.index === selectedServer.index
        );

        if (subServer && subServer.id) {
          console.log('Found matching SUB server, fetching subtitles...');
          const subStreamData = await megacloud({ selectedServer: subServer, id });

          if (subStreamData && subStreamData.tracks) {
            const subTitles = subStreamData.tracks.filter(
              (t) => t.kind === 'captions' || t.kind === 'subtitles'
            );

            if (subTitles.length > 0) {
              console.log(`Found ${subTitles.length} subtitle tracks from SUB version`);
              streamingLink.tracks = [...(streamingLink.tracks || []), ...subTitles];
            }
          }
        }
      } catch (error) {
        console.log('Failed to fetch subtitles from SUB version:', error.message);
      }
    }
  }

  return streamingLink;
};
