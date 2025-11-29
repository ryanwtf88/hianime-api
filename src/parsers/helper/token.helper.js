import axios from 'axios';
import * as cheerio from 'cheerio';
import config from '../../config/config.js';

const { baseurl } = config;

export default async function extractToken(url) {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        Referer: `${baseurl}/`,
      },
    });

    const $ = cheerio.load(html);
    const results = {};
    const meta = $('meta[name="_gg_fb"]').attr('content');
    if (meta) results.meta = meta;
    const dpi = $('[data-dpi]').attr('data-dpi');
    if (dpi) results.dataDpi = dpi;
    const nonceScript = $('script[nonce]')
      .filter((i, el) => {
        return $(el).text().includes('empty nonce script');
      })
      .attr('nonce');
    if (nonceScript) results.nonce = nonceScript;
    const stringAssignRegex = /window\.(\w+)\s*=\s*["']([\w-]+)["']/g;
    const stringMatches = [...html.matchAll(stringAssignRegex)];
    for (const [, key, value] of stringMatches) {
      results[`window.${key}`] = value;
    }

    const objectAssignRegex = /window\.(\w+)\s*=\s*(\{[\s\S]*?\});/g;
    const matches = [...html.matchAll(objectAssignRegex)];
    for (const [, varName, rawObj] of matches) {
      try {
        const parsedObj = eval('(' + rawObj + ')');
        if (parsedObj && typeof parsedObj === 'object') {
          const stringValues = Object.values(parsedObj).filter((val) => typeof val === 'string');
          const concatenated = stringValues.join('');
          if (concatenated.length >= 20) {
            results[`window.${varName}`] = concatenated;
          }
        }
      } catch {
      }
    }

    $('*')
      .contents()
      .each(function () {
        if (this.type === 'comment') {
          const match = this.data.trim().match(/^_is_th:([\w-]+)$/);
          if (match) {
            results.commentToken = match[1].trim();
          }
        }
      });

    const token = Object.values(results)[0];
    return token || null;
  } catch (err) {
    console.error('Error:', err.message);
    return null;
  }
}
