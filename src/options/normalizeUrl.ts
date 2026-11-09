import * as log from 'loglevel';

const SCHEME_REGEX = /^[a-z][a-z\d+.-]*:/i;
const HOST_PORT_REGEX = /^[a-z][a-z\d+.-]*:\d+(?:[/?#]|$)/i;

function appendProtocol(inputUrl: string): string {
  if (!SCHEME_REGEX.test(inputUrl) || HOST_PORT_REGEX.test(inputUrl)) {
    const urlWithProtocol = `https://${inputUrl}`;
    log.warn(
      `URL "${inputUrl}" lacks a protocol.`,
      `Will try to parse it as HTTPS: "${urlWithProtocol}".`,
      `Please pass "http://${inputUrl}" if this is what you meant.`,
    );
    return urlWithProtocol;
  }
  return inputUrl;
}

export function normalizeUrl(urlToNormalize: string): string {
  const urlWithProtocol = appendProtocol(urlToNormalize.trim());

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlWithProtocol);
  } catch (err: unknown) {
    log.error('normalizeUrl ERROR', err);
    throw new Error(`Your url "${urlWithProtocol}" is invalid`);
  }
  const normalizedUrl = parsedUrl.toString();
  log.debug(`Normalized URL ${urlToNormalize} to:`, normalizedUrl);
  return normalizedUrl;
}
