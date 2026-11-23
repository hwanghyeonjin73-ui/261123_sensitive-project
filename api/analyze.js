import { AppError, toErrorPayload } from '../lib/errors.js';
import { validateInput } from '../lib/validate.js';
import { analyzeSentiment } from '../lib/sentiment.js';

function json(status, payload, extraHeaders = {}) {
  return Response.json(payload, {
    status,
    headers: { 'Cache-Control': 'no-store', ...extraHeaders },
  });
}

async function readJsonBody(request) {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) throw new AppError('INVALID_REQUEST');
  try {
    return await request.json();
  } catch {
    throw new AppError('INVALID_REQUEST');
  }
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      const { status, payload } = toErrorPayload(new AppError('METHOD_NOT_ALLOWED'));
      return json(status, payload, { Allow: 'POST' });
    }
    try {
      const body = await readJsonBody(request);
      const text = validateInput(body);
      const data = await analyzeSentiment(text);
      return json(200, { ok: true, data });
    } catch (error) {
      const { status, payload } = toErrorPayload(error);
      return json(status, payload);
    }
  },
};
