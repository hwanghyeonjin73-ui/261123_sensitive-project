// dev-server.js — 로컬 개발 전용 서버입니다. Vercel 배포에는 사용되지 않습니다.
// public/ 폴더의 파일을 보여 주고, /api/analyze 요청은 api/analyze.js로 넘깁니다.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import handler from './api/analyze.js';

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = resolve('public');
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

// 요청 본문을 끝까지 읽어 Buffer로 돌려줍니다.
async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

// Node.js 요청을 Web 표준 Request로 바꿔 Vercel과 같은 방식으로 핸들러를 호출합니다.
async function handleApi(req, res, url) {
  const hasBody = !['GET', 'HEAD'].includes(req.method);
  const request = new Request(url, {
    method: req.method,
    headers: { 'content-type': req.headers['content-type'] ?? '' },
    body: hasBody ? await readBody(req) : undefined,
  });
  const response = await handler.fetch(request);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
}

async function handleStatic(res, url) {
  const pathname = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  const filePath = resolve(join(PUBLIC_DIR, pathname));
  // public 폴더 바깥 파일을 읽지 못하게 막습니다.
  if (!filePath.startsWith(PUBLIC_DIR + sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }
  const data = await readFile(filePath);
  res.writeHead(200, { 'Content-Type': MIME_TYPES[extname(filePath)] ?? 'application/octet-stream' });
  res.end(data);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname === '/api/analyze') {
      await handleApi(req, res, url);
    } else {
      await handleStatic(res, url);
    }
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }
    console.error('[dev-server]', error.message);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`로컬 서버 실행 중: http://localhost:${PORT}`);
});
