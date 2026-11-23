import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateInput } from '../lib/validate.js';
import { AppError } from '../lib/errors.js';

test('V-01 앞뒤 공백 제거 후 정상 반환', () => {
  const result = validateInput({ text: '  안녕하세요  ' });
  assert.equal(result, '안녕하세요');
});

test('V-02 빈 문자열은 EMPTY_INPUT', () => {
  assert.throws(
    () => validateInput({ text: '' }),
    (err) => err instanceof AppError && err.code === 'EMPTY_INPUT',
  );
});

test('V-03 공백/줄바꿈만 있는 경우 EMPTY_INPUT', () => {
  assert.throws(
    () => validateInput({ text: '  \n\t ' }),
    (err) => err instanceof AppError && err.code === 'EMPTY_INPUT',
  );
});

test('V-04 1000자는 통과', () => {
  const input = '가'.repeat(1000);
  const result = validateInput({ text: input });
  assert.equal(result, input);
});

test('V-05 1001자는 TOO_LONG', () => {
  assert.throws(
    () => validateInput({ text: '가'.repeat(1001) }),
    (err) => err instanceof AppError && err.code === 'TOO_LONG',
  );
});

test('V-06 이모지 1000개는 1000자로 통과', () => {
  const input = '😀'.repeat(1000);
  const result = validateInput({ text: input });
  assert.equal(result, input);
});

test('V-07 잘못된 형식은 INVALID_REQUEST', () => {
  const invalidCases = [null, [], {}, { text: 123 }, '문자열'];
  for (const item of invalidCases) {
    assert.throws(
      () => validateInput(item),
      (err) => err instanceof AppError && err.code === 'INVALID_REQUEST',
    );
  }
});
