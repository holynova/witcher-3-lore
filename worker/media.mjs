// Static Assets currently ignores Range on these deployed MP4s. Keep the
// original asset URL and expose single byte ranges for browser chapter seeking.
export function parseRange(value, size) {
  if (!value) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(value);
  if (!match || (!match[1] && !match[2])) return false;
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= size || end < start) return false;
  return { start, end };
}

export default {
  async fetch(request, env) {
    if (!['GET', 'HEAD'].includes(request.method) || !new URL(request.url).pathname.endsWith('.mp4')) {
      return env.ASSETS.fetch(request);
    }
    const sourceHeaders = new Headers(request.headers);
    sourceHeaders.delete('range');
    sourceHeaders.delete('if-range');
    const asset = await env.ASSETS.fetch(new Request(request.url, { method: 'GET', headers: sourceHeaders }));
    if (asset.status !== 200) return asset;
    const buffer = await asset.arrayBuffer();
    const size = buffer.byteLength;
    const headers = new Headers(asset.headers);
    headers.set('Accept-Ranges', 'bytes');
    headers.delete('Content-Encoding');
    const validator = request.headers.get('if-range');
    const matches = !validator || validator === headers.get('etag') || validator === headers.get('last-modified');
    const range = request.method === 'HEAD' || !matches ? null : parseRange(request.headers.get('range'), size);
    if (range === false) {
      headers.set('Content-Range', `bytes */${size}`);
      headers.delete('Content-Length');
      return new Response(null, { status: 416, headers });
    }
    if (range) {
      const bytes = new Uint8Array(buffer.slice(range.start, range.end + 1));
      headers.set('Content-Range', `bytes ${range.start}-${range.end}/${size}`);
      headers.set('Content-Length', String(bytes.byteLength));
      return new Response(bytes, { status: 206, headers });
    }
    headers.set('Content-Length', String(size));
    return new Response(request.method === 'HEAD' ? null : new Uint8Array(buffer), { headers });
  },
};
