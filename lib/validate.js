import { AppError } from './errors.js';

// 화면 public/js/config.js의 MAX_TEXT_LENGTH와 반드시 같은 값이어야 합니다.
export const MAX_TEXT_LENGTH = 1000;

// 이모지 등도 1자로 세기 위해 Array.from을 씁니다.
export function countChars(text) {
  return Array.from(text).length;
}

// 요청 본문을 검사하고, 앞뒤 공백을 뺀 텍스트를 돌려줍니다.
export function validateInput(body) {
  const isObject = body !== null && typeof body === 'object' && !Array.isArray(body);
  if (!isObject || typeof body.text !== 'string') {
    throw new AppError('INVALID_REQUEST');
  }
  const text = body.text.trim();
  if (text.length === 0) throw new AppError('EMPTY_INPUT');
  if (countChars(text) > MAX_TEXT_LENGTH) throw new AppError('TOO_LONG');
  return text;
}
