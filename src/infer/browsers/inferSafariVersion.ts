import axios from 'axios';
import * as log from 'loglevel';
import { DEFAULT_SAFARI_VERSION } from '../../constants';

export type SafariVersion = {
  majorVersion: number;
  version: string;
  webkitVersion: string;
};

const SAFARI_VERSIONS_HISTORY_URL =
  'https://en.wikipedia.org/wiki/Safari_version_history';

// Wikimedia answers 403 to clients without a descriptive User-Agent: https://w.wiki/4wJS
const REQUEST_HEADERS = {
  'User-Agent': 'nativefier (https://github.com/ABuljko/nativefier)',
};

function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const diff = (partsA[i] ?? 0) - (partsB[i] ?? 0);
    if (diff !== 0) {
      return diff;
    }
  }
  return 0;
}

export async function getLatestSafariVersion(
  url = SAFARI_VERSIONS_HISTORY_URL,
): Promise<SafariVersion> {
  try {
    log.debug('Grabbing apple version data from', url);
    const response = await axios.get<string>(url, {
      timeout: 5000,
      headers: REQUEST_HEADERS,
    });
    if (response.status !== 200) {
      throw new Error(`Bad request: Status code ${response.status}`);
    }

    // This would be easier with an HTML parser, but we're not going to include an extra dependency for something that dumb
    const rawData: string = response.data;

    const majorVersions = [...rawData.matchAll(/id="Safari_(\d+)"/g)]
      .map((match) => parseInt(match[1], 10))
      .sort((a, b) => b - a);
    const versions = [...rawData.matchAll(/>\s*(\d+\.\d+(?:\.\d+)?)\s*</g)].map(
      (match) => match[1],
    );

    for (const majorVersion of majorVersions) {
      const version = versions
        .filter((v) => parseInt(v, 10) === majorVersion)
        .sort(compareVersions)
        .pop();
      if (version) {
        return {
          majorVersion,
          version,
          webkitVersion: DEFAULT_SAFARI_VERSION.webkitVersion,
        };
      }
    }
    return DEFAULT_SAFARI_VERSION;
  } catch (err: unknown) {
    log.error('getLatestSafariVersion ERROR', err);
    log.debug('Falling back to default Safari version', DEFAULT_SAFARI_VERSION);
    return DEFAULT_SAFARI_VERSION;
  }
}
