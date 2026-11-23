import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeResult } from '../lib/normalize.js';
import { AppError } from '../lib/errors.js';

test('N-01 positive 정규화 및 label 긍정', () => {
  const result = normalizeResult({ sentiment: 'positive', confidence: 90, reason: '좋아요' });
  assert.deepEqual(result, {
    sentiment: 'positive',
    label: '긍정',
    confidence: 90,
    reason: '좋아요',
  });
});

test('N-02 negative, neutral 각각 라벨 부정, 중립', () => {
  const neg = normalizeResult({ sentiment: 'negative', confidence: 80, reason: '나빠요' });
  assert.equal(neg.label, '부정');

  const neu = normalizeResult({ sentiment: 'neutral', confidence: 50, reason: '보통' });
  assert.equal(neu.label, '중립');
});

test('N-03 confidence 소수점 반올림', () => {
  const result = normalizeResult({ sentiment: 'positive', confidence: 87.6, reason: '좋아요' });
  assert.equal(result.confidence, 88);
});

test('N-04 confidence 유효 범위 밖은 INVALID_AI_RESPONSE', () => {
  const cases = [-1, 101, NaN, '80'];
  for (const c of cases) {
    assert.throws(
      () => normalizeResult({ sentiment: 'positive', confidence: c, reason: '좋아요' }),
      (err) => err instanceof AppError && err.code === 'INVALID_AI_RESPONSE',
    );
  }
});

test('N-05 지원하지 않는 sentiment는 INVALID_AI_RESPONSE', () => {
  assert.throws(
    () => normalizeResult({ sentiment: 'happy', confidence: 80, reason: '좋아요' }),
    (err) => err instanceof AppError && err.code === 'INVALID_AI_RESPONSE',
  );
});

test('N-06 빈 reason은 INVALID_AI_RESPONSE', () => {
  const cases = ['', '   ', null];
  for (const r of cases) {
    assert.throws(
      () => normalizeResult({ sentiment: 'positive', confidence: 80, reason: r }),
      (err) => err instanceof AppError && err.code === 'INVALID_AI_RESPONSE',
    );
  }
});

test('N-07 300자 초과 reason은 300자 + … 로 자름', () => {
  const longReason = '가'.repeat(400);
  const result = normalizeResult({ sentiment: 'positive', confidence: 80, reason: longReason });
  assert.equal(result.reason.length, 301);
  assert.equal(result.reason, `${'가'.repeat(300)}…`);
});

test('N-08 객체가 아닌 응답은 INVALID_AI_RESPONSE', () => {
  const cases = [null, '문자열'];
  for (const item of cases) {
    assert.throws(
      () => normalizeResult(item),
      (err) => err instanceof AppError && err.code === 'INVALID_AI_RESPONSE',
    );
  }
});
