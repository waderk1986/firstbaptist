/// <reference types="@cloudflare/workers-types" />

/**
 * Cloudflare Pages middleware — per-request CSP nonce for HTML responses.
 *
 * Generates a fresh 128-bit nonce, stamps it onto every <script> and <style>
 * element in the response, and emits a matching nonce-based CSP header.
 * With 'strict-dynamic', any nonced script can dynamically load further
 * scripts (Astro's hydration runtime + /_astro/*.js chunks) without those
 * needing to be individually whitelisted.
 *
 * Non-HTML responses pass through untouched — static asset headers come
 * from public/_headers.
 */

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

export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
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
};
