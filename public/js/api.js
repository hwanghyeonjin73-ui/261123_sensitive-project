import { API_ENDPOINT, REQUEST_TIMEOUT_MS, CLIENT_ERRORS } from './config.js';

function clientError(code) {
  return { ok: false, error: { code, ...CLIENT_ERRORS[code] } };
}

// 서버에 감성 분석을 요청합니다. 어떤 경우에도 예외를 던지지 않습니다.
export async function analyzeText(text) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
  } catch (error) {
    return clientError(error.name === 'AbortError' ? 'NETWORK_TIMEOUT' : 'NETWORK_ERROR');
  } finally {
    clearTimeout(timer);
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    return clientError('UNKNOWN_ERROR');
  }

  if (payload?.ok === true && payload.data) return payload;
  if (payload?.ok === false && payload.error?.code && payload.error?.message) {
    return { ok: false, error: { retryable: false, ...payload.error } };
  }
  return clientError('UNKNOWN_ERROR');
}
