const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { gzipSync } = require('node:zlib');
const files = { '/': ['index.html', 'text/html'], '/complete': ['index.html', 'text/html'], '/index.html': ['index.html', 'text/html'], '/style.css': ['style.css', 'text/css'], '/eye.js': ['eye.js', 'text/javascript'], '/script.js': ['script.js', 'text/javascript'], '/favicon.svg': ['favicon.svg', 'image/svg+xml'] };
http.createServer((req, res) => {
  if (req.url === '/favicon.ico') { res.writeHead(204); res.end(); return; }
  if (req.url === '/demo-login' && req.method === 'POST') {
    let bytes = 0;
    req.on('data', (chunk) => {
      bytes += chunk.length;
      if (bytes > 16384) { res.writeHead(413); res.end('Demo input too large'); req.destroy(); }
    });
    req.on('end', () => {
      if (!res.writableEnded) { res.writeHead(303, { Location: '/complete', 'Cache-Control': 'no-store' }); res.end(); }
    });
    return;
  }
  const file = files[(req.url || '/').split('?')[0]];
  if (!file || !['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(404); res.end('Not found'); return;
  }
  fs.readFile(path.join(__dirname, file[0]), (error, data) => {
    const compress = !error && /\bgzip\b/.test(req.headers['accept-encoding'] || '');
    const content = error ? Buffer.from('Unable to read file') : compress ? gzipSync(data) : data;
    res.writeHead(error ? 500 : 200, {
      ...(compress ? { 'Content-Encoding': 'gzip' } : {}),
      'Content-Length': content.length,
      Vary: 'Accept-Encoding',
      'Content-Type': file[1] + '; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': "default-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; style-src 'self' 'unsafe-inline'"
    });
    res.end(req.method === 'HEAD' ? undefined : content);
  });
}).listen(3001, '127.0.0.1', () => console.log('Password demo: http://127.0.0.1:3001'));
