import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ERROR_DEFINITIONS } from '../lib/errors.js';

// 테스트 중 실제 OpenAI 호출이 일어나지 않도록 키를 지웁니다. import보다 먼저 실행합니다.
delete process.env.OPENAI_API_KEY;
const { default: handler } = await import('../api/analyze.js');

const ENDPOINT = 'http://localhost/api/analyze';
const post = (body, contentType = 'application/json') =>
  handler.fetch(
    new Request(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': contentType },
      body,
    }),
  );

test('H-01 GET 요청은 405', async () => {
  const response = await handler.fetch(new Request(ENDPOINT, { method: 'GET' }));
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'POST');
  const payload = await response.json();
  assert.equal(payload.error.code, 'METHOD_NOT_ALLOWED');
});

test('H-02 POST 빈 텍스트는 400 EMPTY_INPUT', async () => {
  const response = await post(JSON.stringify({ text: '' }));
  assert.equal(response.status, 400);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const payload = await response.json();
  assert.equal(payload.error.code, 'EMPTY_INPUT');
});

test('H-03 POST 본문이 JSON이 아니면 400 INVALID_REQUEST', async () => {
  const response = await post('not json');
  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.equal(payload.error.code, 'INVALID_REQUEST');
});

test('H-04 POST Content-Type이 text/plain이면 400 INVALID_REQUEST', async () => {
  const response = await post('{"text":"안녕하세요"}', 'text/plain');
  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.equal(payload.error.code, 'INVALID_REQUEST');
});

test('H-05 API 키 없이 POST 시 500 SERVER_CONFIG 및 retryable false', async () => {
  const response = await post(JSON.stringify({ text: '좋아요' }));
  assert.equal(response.status, 500);
  const payload = await response.json();
  assert.equal(payload.error.code, 'SERVER_CONFIG');
  assert.equal(payload.error.retryable, false);
});

test('H-06 ERROR_DEFINITIONS 항목 수 12개 및 형식 검증', () => {
  const keys = Object.keys(ERROR_DEFINITIONS);
  assert.equal(keys.length, 12);
  for (const key of keys) {
    const def = ERROR_DEFINITIONS[key];
    assert.equal(typeof def.status, 'number');
    assert.equal(typeof def.message, 'string');
    assert.notEqual(def.message.trim(), '');
    assert.equal(typeof def.retryable, 'boolean');
  }
});

test('H-07 모든 실패 응답 형식 일치 확인', async () => {
  const response = await post(JSON.stringify({ text: '' }));
  const payload = await response.json();
  assert.equal(payload.ok, false);
  assert.ok(payload.error);
  assert.equal(typeof payload.error.code, 'string');
  assert.equal(typeof payload.error.message, 'string');
  assert.equal(typeof payload.error.retryable, 'boolean');
});
