import axios from 'axios';
import * as log from 'loglevel';

const FILE_INDEX_ID = 'file-index';

const COMMENT_REGEX = /<!--[\s\S]*?-->/g;
const DIV_TAG_REGEX = /<div\b[^>]*>|<\/div\s*>/gi;
const LINK_REGEX = /<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi;
const ID_ATTR_REGEX = /\bid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i;
const HREF_ATTR_REGEX = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i;
const TAG_REGEX = /<[^>]*>/g;
const ENTITY_REGEX = /&(?:#(\d+)|#[xX]([\da-fA-F]+)|([a-zA-Z]+));/g;

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

export type GitCloudFile = {
  name: string;
  url: string;
};

function getAttribute(attributes: string, regex: RegExp): string | undefined {
  const match = regex.exec(attributes);
  if (!match) {
    return undefined;
  }
  return match[1] ?? match[2] ?? match[3];
}

function decodeEntities(text: string): string {
  return text.replace(
    ENTITY_REGEX,
    (entity, dec: string, hex: string, name: string) => {
      if (dec !== undefined) {
        return String.fromCodePoint(parseInt(dec, 10));
      }
      if (hex !== undefined) {
        return String.fromCodePoint(parseInt(hex, 16));
      }
      return NAMED_ENTITIES[name.toLowerCase()] ?? entity;
    },
  );
}

/**
 * Extract the `#file-index` element's contents, tracking nesting so that a
 * `<div>` *inside* the index doesn't end it early.
 */
function extractFileIndex(rawHtml: string): string | undefined {
  // Comments are stripped first, so a `</div>` inside one can't end the index early
  const html = rawHtml.replace(COMMENT_REGEX, '');
  DIV_TAG_REGEX.lastIndex = 0;
  let start: number | undefined = undefined;
  let depth = 0;

  for (
    let tag = DIV_TAG_REGEX.exec(html);
    tag;
    tag = DIV_TAG_REGEX.exec(html)
  ) {
    const isOpening = !tag[0].startsWith('</');
    if (start === undefined) {
      if (
        isOpening &&
        getAttribute(tag[0], ID_ATTR_REGEX)?.trim() === FILE_INDEX_ID
      ) {
        start = tag.index + tag[0].length;
        depth = 1;
      }
      continue;
    }

    depth += isOpening ? 1 : -1;
    if (depth === 0) {
      return html.slice(start, tag.index);
    }
  }
  return undefined;
}

/**
 * List the files published by a GitCloud index page, e.g. our own
 * https://nativefier.github.io/nativefier-icons/ .
 */
export async function gitCloud(pageUrl: string): Promise<GitCloudFile[]> {
  const { data } = await axios.get<string>(pageUrl);
  const fileIndex = extractFileIndex(data);
  if (fileIndex === undefined) {
    log.debug(`Could not find a #${FILE_INDEX_ID} listing at`, pageUrl);
    return [];
  }

  const files: GitCloudFile[] = [];
  for (const link of fileIndex.matchAll(LINK_REGEX)) {
    const url = getAttribute(link[1], HREF_ATTR_REGEX);
    const name = decodeEntities(link[2].replace(TAG_REGEX, '')).trim();
    if (name && url) {
      files.push({ name, url: decodeEntities(url) });
    }
  }
  return files;
}
