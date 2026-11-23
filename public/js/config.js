// 화면에서 쓰는 상수와 문구를 한 곳에 모아 둡니다.
// MAX_TEXT_LENGTH는 서버 lib/validate.js와 반드시 같은 값이어야 합니다.
export const MAX_TEXT_LENGTH = 1000;

// 서버 응답을 기다리는 최대 시간(밀리초). 서버 AI 대기(20초)보다 길게 잡습니다.
export const REQUEST_TIMEOUT_MS = 30000;

export const API_ENDPOINT = '/api/analyze';

export const UI_TEXT = {
  analyze: '분석하기',
  analyzing: '분석 중…',
};

// 입력창 아래에 표시하는 입력 검증 문구 (docs/05-error-handling.md와 동일)
export const INPUT_ERRORS = {
  EMPTY_INPUT: '분석할 텍스트를 입력해 주세요.',
  TOO_LONG: '텍스트는 1,000자 이하로 입력해 주세요.',
};

// 서버 응답을 받지 못했을 때 브라우저에서 만드는 오류 (docs/05-error-handling.md와 동일)
export const CLIENT_ERRORS = {
  NETWORK_ERROR: { message: '인터넷 연결을 확인한 뒤 다시 시도해 주세요.', retryable: true },
  NETWORK_TIMEOUT: { message: '응답 시간이 초과됐어요. 다시 시도해 주세요.', retryable: true },
  UNKNOWN_ERROR: { message: '알 수 없는 오류가 발생했어요. 잠시 후 다시 시도해 주세요.', retryable: true },
};

export const SENTIMENT_CLASS = {
  positive: 'is-positive',
  negative: 'is-negative',
  neutral: 'is-neutral',
};

export const EXAMPLES = [
  { label: '선물 후기', text: '오늘 받은 선물이 너무 마음에 들어서 하루 종일 기분이 좋았어요!' },
  { label: '배송 불만', text: '배송이 일주일이나 늦어지고 고객센터는 연락도 안 돼서 정말 실망했어요.' },
  { label: '회의 안내', text: '내일 오전 10시에 3층 회의실에서 주간 회의가 있습니다.' },
];
