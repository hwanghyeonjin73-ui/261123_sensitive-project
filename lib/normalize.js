import { AppError } from './errors.js';

export const SENTIMENT_LABELS = {
  positive: '긍정',
  negative: '부정',
  neutral: '중립',
};

export const MAX_REASON_LENGTH = 300;

// AI 응답을 검사해 화면에 보낼 형태로 바꿉니다. 규칙에 어긋나면 INVALID_AI_RESPONSE.
export function normalizeResult(raw) {
  if (raw === null || typeof raw !== 'object') throw new AppError('INVALID_AI_RESPONSE');
  const { sentiment, confidence, reason } = raw;

  if (!Object.hasOwn(SENTIMENT_LABELS, sentiment)) throw new AppError('INVALID_AI_RESPONSE');
  if (typeof confidence !== 'number' || !Number.isFinite(confidence)) throw new AppError('INVALID_AI_RESPONSE');
  if (confidence < 0 || confidence > 100) throw new AppError('INVALID_AI_RESPONSE');
  if (typeof reason !== 'string' || reason.trim() === '') throw new AppError('INVALID_AI_RESPONSE');

  const chars = Array.from(reason.trim());
  const safeReason = chars.length > MAX_REASON_LENGTH
    ? `${chars.slice(0, MAX_REASON_LENGTH).join('')}…`
    : chars.join('');

  return {
    sentiment,
    label: SENTIMENT_LABELS[sentiment],
    confidence: Math.round(confidence),
    reason: safeReason,
  };
}
