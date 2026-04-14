/// <reference types="@cloudflare/workers-types" />

/**
 * Cloudflare Worker — serves static assets and injects a per-request CSP
 * nonce on HTML responses.
 *
 * Non-HTML asset responses pass through unchanged (their headers come from
 * public/_headers). HTML responses get a fresh 128-bit nonce stamped onto
 * every <script> and <style> element via HTMLRewriter, plus a matching CSP
 * header with `script-src 'nonce-XXX' 'strict-dynamic'`. strict-dynamic
 * means any nonced script can dynamically load additional scripts — this
 * covers Astro's hydration runtime and all /_astro/*.js chunks without
 * whitelisting each file.
 */

interface Env {
  ASSETS: Fetcher;
}

const b64url = (bytes: Uint8Array) => {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const makeNonce = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return b64url(bytes);
};

const buildCsp = (nonce: string) =>
  [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "img-src 'self' data:",
    "font-src 'self' https://fonts.gstatic.com",
    `style-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://fonts.googleapis.com`,
    `script-src 'nonce-${nonce}' 'strict-dynamic'`,
    "media-src 'self'",
    "connect-src 'self'",
  ].join('; ');

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') ?? '';

    if (!contentType.toLowerCase().includes('text/html')) {
      return response;
    }

    const nonce = makeNonce();

    const rewritten = new HTMLRewriter()
      .on('script', {
        element(el) {
          el.setAttribute('nonce', nonce);
        },
      })
      .on('style', {
        element(el) {
          el.setAttribute('nonce', nonce);
        },
      })
      .transform(response);

    const headers = new Headers(rewritten.headers);
    headers.set('Content-Security-Policy', buildCsp(nonce));

    return new Response(rewritten.body, {
      status: rewritten.status,
      statusText: rewritten.statusText,
      headers,
    });
  },
} satisfies ExportedHandler<Env>;
