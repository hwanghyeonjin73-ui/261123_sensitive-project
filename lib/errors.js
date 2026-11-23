// 오류 코드 기준표입니다. docs/05-error-handling.md §2.1과 반드시 같아야 합니다.
export const ERROR_DEFINITIONS = {
  EMPTY_INPUT: { status: 400, retryable: false, message: '분석할 텍스트를 입력해 주세요.' },
  TOO_LONG: { status: 400, retryable: false, message: '텍스트는 1,000자 이하로 입력해 주세요.' },
  INVALID_REQUEST: { status: 400, retryable: false, message: '요청 형식이 올바르지 않아요. 페이지를 새로고침한 뒤 다시 시도해 주세요.' },
  METHOD_NOT_ALLOWED: { status: 405, retryable: false, message: '허용되지 않은 요청 방식이에요.' },
  AI_REFUSED: { status: 422, retryable: false, message: '이 텍스트는 분석할 수 없어요. 다른 문장으로 시도해 주세요.' },
  AI_RATE_LIMIT: { status: 429, retryable: true, message: '요청이 많아 잠시 처리할 수 없어요. 잠시 후 다시 시도해 주세요.' },
  SERVER_CONFIG: { status: 500, retryable: false, message: '서버 설정에 문제가 있어요. 관리자에게 문의해 주세요.' },
  INTERNAL_ERROR: { status: 500, retryable: true, message: '알 수 없는 오류가 발생했어요. 잠시 후 다시 시도해 주세요.' },
  AI_UNAVAILABLE: { status: 502, retryable: true, message: 'AI 서비스에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.' },
  INVALID_AI_RESPONSE: { status: 502, retryable: true, message: '분석 결과를 처리하지 못했어요. 다시 시도해 주세요.' },
  AI_QUOTA_EXCEEDED: { status: 503, retryable: false, message: '서비스 사용 한도에 도달했어요. 관리자에게 문의해 주세요.' },
  AI_TIMEOUT: { status: 504, retryable: true, message: 'AI 응답이 너무 오래 걸리고 있어요. 잠시 후 다시 시도해 주세요.' },
};

// 로그를 남기지 않는 오류 (사용자 입력 문제라 서버 문제가 아님)
const SILENT_CODES = new Set(['EMPTY_INPUT', 'TOO_LONG', 'INVALID_REQUEST', 'METHOD_NOT_ALLOWED']);

export class AppError extends Error {
  constructor(code, cause) {
    const definition = ERROR_DEFINITIONS[code] ?? ERROR_DEFINITIONS.INTERNAL_ERROR;
    super(definition.message);
    this.name = 'AppError';
    this.code = ERROR_DEFINITIONS[code] ? code : 'INTERNAL_ERROR';
    this.status = definition.status;
    this.retryable = definition.retryable;
    this.cause = cause;
  }
}

// 어떤 오류든 { status, payload } 형태의 응답 재료로 바꿉니다.
export function toErrorPayload(error) {
  const appError = error instanceof AppError ? error : new AppError('INTERNAL_ERROR', error);
  if (!SILENT_CODES.has(appError.code)) {
    const cause = appError.cause;
    // 입력 텍스트·API 키·AI 응답 원문은 절대 기록하지 않습니다.
    console.error('[analyze]', appError.code, cause?.constructor?.name ?? '', cause?.status ?? '');
  }
  return {
    status: appError.status,
    payload: {
      ok: false,
      error: { code: appError.code, message: appError.message, retryable: appError.retryable },
    },
  };
}
