# 05. 오류 처리 기준표

> 이 문서는 **오류 코드·HTTP 상태·사용자 메시지의 유일한 기준(Single Source of Truth)** 입니다.
> 서버(`lib/errors.js`)와 화면(`public/js/config.js`)의 오류 문구는 이 표와 **글자 하나까지** 같아야 합니다.

---

## 1. 오류 메시지 작성 원칙

1. **무슨 일이 생겼는지 + 무엇을 하면 되는지**를 한 문장에 담습니다.
2. 해요체, 마침표로 끝냅니다.
3. 기술 용어(500, API, JSON, timeout 등)를 사용자 문구에 쓰지 않습니다.
4. 사용자 잘못처럼 들리는 표현("잘못 입력하셨습니다")을 쓰지 않습니다.

---

## 2. 오류 코드 표

### 2.1 서버가 보내는 오류 (`lib/errors.js`에 정의)

| 코드 | HTTP | 언제 | 사용자 메시지 | 다시 시도 (`retryable`) |
|---|---|---|---|---|
| `EMPTY_INPUT` | 400 | 공백 제거 후 빈 텍스트 | 분석할 텍스트를 입력해 주세요. | false |
| `TOO_LONG` | 400 | 1,000자 초과 | 텍스트는 1,000자 이하로 입력해 주세요. | false |
| `INVALID_REQUEST` | 400 | JSON이 아님, `text` 없음/문자열 아님, Content-Type 불일치 | 요청 형식이 올바르지 않아요. 페이지를 새로고침한 뒤 다시 시도해 주세요. | false |
| `METHOD_NOT_ALLOWED` | 405 | POST 이외 요청 | 허용되지 않은 요청 방식이에요. | false |
| `AI_REFUSED` | 422 | AI가 분석을 거부함 | 이 텍스트는 분석할 수 없어요. 다른 문장으로 시도해 주세요. | false |
| `AI_RATE_LIMIT` | 429 | OpenAI 요청 과다 | 요청이 많아 잠시 처리할 수 없어요. 잠시 후 다시 시도해 주세요. | true |
| `SERVER_CONFIG` | 500 | API 키 없음/잘못됨, 권한 없음, 모델 없음 | 서버 설정에 문제가 있어요. 관리자에게 문의해 주세요. | false |
| `INTERNAL_ERROR` | 500 | 예상하지 못한 서버 오류 | 알 수 없는 오류가 발생했어요. 잠시 후 다시 시도해 주세요. | true |
| `AI_UNAVAILABLE` | 502 | OpenAI 연결 실패, OpenAI 서버 오류(5xx) | AI 서비스에 연결할 수 없어요. 잠시 후 다시 시도해 주세요. | true |
| `INVALID_AI_RESPONSE` | 502 | AI 응답이 규칙에 맞지 않거나 미완성 | 분석 결과를 처리하지 못했어요. 다시 시도해 주세요. | true |
| `AI_QUOTA_EXCEEDED` | 503 | OpenAI 사용 한도·잔액 소진 | 서비스 사용 한도에 도달했어요. 관리자에게 문의해 주세요. | false |
| `AI_TIMEOUT` | 504 | OpenAI 응답 20초 초과 | AI 응답이 너무 오래 걸리고 있어요. 잠시 후 다시 시도해 주세요. | true |

### 2.2 브라우저가 만드는 오류 (`public/js/config.js`의 `CLIENT_ERRORS`)

| 코드 | 언제 | 사용자 메시지 | 다시 시도 |
|---|---|---|---|
| `NETWORK_ERROR` | 인터넷 끊김 등으로 서버에 닿지 못함 | 인터넷 연결을 확인한 뒤 다시 시도해 주세요. | true |
| `NETWORK_TIMEOUT` | 30초 동안 응답 없음 | 응답 시간이 초과됐어요. 다시 시도해 주세요. | true |
| `UNKNOWN_ERROR` | 응답이 JSON이 아니거나 형식이 다름 | 알 수 없는 오류가 발생했어요. 잠시 후 다시 시도해 주세요. | true |

### 2.3 입력창 아래 표시 문구 (`public/js/config.js`의 `INPUT_ERRORS`)

서버에 보내기 **전에** 화면에서 검사해 입력창 아래(`#input-error`)에 표시합니다. 이때는 결과 영역의 오류 카드를 띄우지 않습니다.

| 코드 | 문구 |
|---|---|
| `EMPTY_INPUT` | 분석할 텍스트를 입력해 주세요. |
| `TOO_LONG` | 텍스트는 1,000자 이하로 입력해 주세요. |

---

## 3. `lib/errors.js` (참고 구현 — 이대로 작성)

```js
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
```

---

## 4. 화면에서 오류가 보이는 위치

| 오류 종류 | 표시 위치 | 결과 영역 상태 |
|---|---|---|
| 화면 검사 오류 (`INPUT_ERRORS`) | 입력창 아래 `#input-error` (빨간 글자) | 바뀌지 않음 (이전 결과 유지) |
| 서버 오류 (§2.1) / 브라우저 오류 (§2.2) | 결과 영역 `#error-box` | `error` 상태 |

- `#error-box`의 `#error-message`에는 서버가 보낸 `message`를 **그대로** 표시합니다.
- `retryable: true`일 때만 `#retry-button`을 보여 줍니다.

---

## 5. 오류 상황별 확인 방법 (개발자·검수자용)

| 확인할 오류 | 재현 방법 |
|---|---|
| `EMPTY_INPUT` (화면) | 입력창을 비우거나 공백만 넣고 분석하기 |
| `TOO_LONG` (화면) | 1,001자 붙여넣기 |
| `SERVER_CONFIG` | `.env`의 `OPENAI_API_KEY`를 비우고 서버 재시작 후 분석 |
| `SERVER_CONFIG` (모델) | `.env`에 `OPENAI_MODEL=없는-모델` 설정 후 재시작·분석 |
| `NETWORK_ERROR` | 화면을 연 뒤 서버(`npm run dev`)를 끄고 분석 |
| `NETWORK_TIMEOUT` | 개발자도구 Network 탭 → 속도 제한(Throttling) 사용자 지정 30초 이상 지연 설정 후 분석 (선택 확인 항목) |
| `METHOD_NOT_ALLOWED` | 브라우저 주소창에 `http://localhost:3000/api/analyze` 입력 (GET 요청) |
| `INVALID_REQUEST` | `docs/07` A-04 실행 |

---

## 6. 완료 기준

- [ ] `lib/errors.js`의 `ERROR_DEFINITIONS`가 §2.1 표와 코드·상태·문구·retryable 모두 일치한다
- [ ] `public/js/config.js`의 `CLIENT_ERRORS`, `INPUT_ERRORS`가 §2.2, §2.3과 일치한다
- [ ] §5 재현 방법(선택 항목 제외)으로 각 오류를 만들었을 때 표의 문구가 화면에 그대로 나온다
- [ ] 어떤 오류 상황에서도 서버 프로세스가 종료되지 않는다

---

## 변경 이력
- 2026-11-23: 최초 작성
