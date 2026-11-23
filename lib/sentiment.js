import OpenAI from 'openai';
import { AppError } from './errors.js';
import { SYSTEM_PROMPT, SENTIMENT_SCHEMA } from './prompt.js';
import { normalizeResult } from './normalize.js';

const DEFAULT_MODEL = 'gpt-6-luna';
const AI_TIMEOUT_MS = 20000;

let client = null;

// API 키가 없으면 서버가 켜질 때가 아니라 요청 시점에 SERVER_CONFIG 오류를 냅니다.
function getClient() {
  if (!process.env.OPENAI_API_KEY) throw new AppError('SERVER_CONFIG');
  // maxRetries: 0 — SDK가 자동 재시도하면 대기 시간이 20초를 넘어갑니다. 재시도는 화면의 "다시 시도" 버튼이 담당합니다.
  client ??= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: AI_TIMEOUT_MS,
    maxRetries: 0,
  });
  return client;
}

// OpenAI SDK 오류를 우리 오류 코드로 바꿉니다. 순서가 중요합니다(시간 초과가 연결 오류보다 먼저).
function mapOpenAIError(error) {
  if (error instanceof AppError) return error;
  if (error instanceof OpenAI.APIConnectionTimeoutError) return new AppError('AI_TIMEOUT', error);
  if (error instanceof OpenAI.APIConnectionError) return new AppError('AI_UNAVAILABLE', error);
  if (error instanceof OpenAI.RateLimitError) {
    return new AppError(error.code === 'insufficient_quota' ? 'AI_QUOTA_EXCEEDED' : 'AI_RATE_LIMIT', error);
  }
  if (
    error instanceof OpenAI.AuthenticationError
    || error instanceof OpenAI.PermissionDeniedError
    || error instanceof OpenAI.NotFoundError
  ) {
    return new AppError('SERVER_CONFIG', error);
  }
  if (error instanceof OpenAI.APIError && error.status >= 500) return new AppError('AI_UNAVAILABLE', error);
  return new AppError('INTERNAL_ERROR', error);
}

function hasRefusal(response) {
  return (response.output ?? []).some(
    (item) => item.type === 'message' && (item.content ?? []).some((part) => part.type === 'refusal'),
  );
}

// 텍스트의 감성을 분석해 { sentiment, label, confidence, reason }을 돌려줍니다.
export async function analyzeSentiment(text) {
  const openai = getClient();

  let response;
  try {
    response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
      instructions: SYSTEM_PROMPT,
      input: text,
      store: false,
      text: {
        format: {
          type: 'json_schema',
          name: 'sentiment_result',
          strict: true,
          schema: SENTIMENT_SCHEMA,
        },
      },
    });
  } catch (error) {
    throw mapOpenAIError(error);
  }

  if (hasRefusal(response)) throw new AppError('AI_REFUSED');
  if (response.status !== 'completed') throw new AppError('INVALID_AI_RESPONSE');

  let parsed;
  try {
    parsed = JSON.parse(response.output_text);
  } catch {
    throw new AppError('INVALID_AI_RESPONSE');
  }
  return normalizeResult(parsed);
}
