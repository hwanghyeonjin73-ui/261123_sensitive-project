# 02. UI 디자인 지침

> 첨부된 다크 테마 디자인 시스템(음악 스트리밍 앱 스타일)을 **감성 분석 서비스에 맞게 옮긴 최종 기준**입니다.
> 이 문서의 값이 원본 디자인 문서보다 우선합니다. 여기에 없는 색·크기·효과는 사용하지 않습니다.

---

## 1. 디자인 방향

- **콘텐츠가 주인공인 어둠**: 배경은 거의 검은색(`#121212`)이고, 화면 요소는 짙은 회색 단계로만 구분합니다. 색은 "결과"에만 씁니다.
- **초록색은 기능에만**: 브랜드 초록(`#1ed760`)은 **분석하기 버튼, 긍정 결과, 로고 점, 포커스 강조 외에는 사용하지 않습니다.** 장식·배경으로 쓰지 않습니다.
- **알약(Pill)과 원**: 모든 버튼은 완전히 둥근 알약 모양, 점·스피너·로고는 원형입니다. 네모난 버튼은 만들지 않습니다.
- **조밀하고 단단한 글자**: 글자 크기는 12~24px 범위, 굵기는 400(보통)과 700(굵게) 위주이며 600은 일부에만 씁니다.
- **무거운 그림자, 숨은 테두리**: 회색 실선 테두리(`border: 1px solid`) 대신 `box-shadow inset`으로 테두리를 표현합니다.

### 1.1 원본 디자인 → 이 프로젝트 적용표

| 원본 규칙 | 이 프로젝트 적용 | 이유 |
|---|---|---|
| SpotifyMixUI / Circular 폰트 | **Pretendard** 웹폰트 | 전용 폰트는 사용 불가, 한글 가독성 |
| 버튼 대문자 + 자간 1.4~2px | 한글 버튼은 대문자 없음, 자간 `0.2px` | 한글에는 대문자가 없고 넓은 자간은 어색함 |
| 사이드바 + 하단 재생바 레이아웃 | **가운데 한 줄(단일 컬럼)** 레이아웃 | 기능이 한 가지인 단일 페이지 |
| 앨범 아트가 색을 담당 | **분석 결과**가 색을 담당 | 콘텐츠 = 결과 |
| 입력창 500px 알약 | 여러 줄 입력창은 `8px` 둥근 모서리 | 여러 줄 입력은 알약 모양 불가 |
| 포커스 시 테두리 `#000000` | 포커스 시 안쪽 테두리 `#ffffff` | 어두운 배경에서 검은 테두리는 안 보임 |
| 줄 간격 촘촘함 | 분석 이유 문단만 `1.6` | 한글 문장 가독성 (예외는 이 한 곳뿐) |
| 로고 | 초록 원 + "감성 분석기" 텍스트 | Spotify 로고·이름 사용 금지 |

---

## 2. 글꼴 (Pretendard 웹폰트)

### 2.1 `public/css/fonts.css` — 아래 내용을 **그대로** 저장

```css
@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Thin.woff2') format('woff2');
    font-weight: 100;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-ExtraLight.woff2') format('woff2');
    font-weight: 200;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Light.woff2') format('woff2');
    font-weight: 300;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Regular.woff2') format('woff2');
    font-weight: 400;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Medium.woff2') format('woff2');
    font-weight: 500;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-SemiBold.woff2') format('woff2');
    font-weight: 600;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Bold.woff2') format('woff2');
    font-weight: 700;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-ExtraBold.woff2') format('woff2');
    font-weight: 800;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Black.woff2') format('woff2');
    font-weight: 900;
    font-display: swap;
}

@font-face {
    font-family: 'PretendardVariable';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/2611030106@font-variable-694/variable-694/PretendardVariable.woff2') format('woff2');
    font-weight: 45 930;
    font-display: swap;
}

/* 가변: font-family: 'PretendardVariable'; font-variation-settings: "wght" 400; */
```

### 2.2 사용 규칙
- 화면 전체 글꼴은 **고정 굵기 `'Pretendard'`** 를 사용합니다. `'PretendardVariable'`은 정의만 두고 사용하지 않습니다.
- 브라우저는 실제로 쓰인 굵기 파일만 내려받으므로, 사용하지 않는 @font-face가 있어도 속도 문제는 없습니다.
- 사용하는 굵기는 **400, 600, 700 세 가지뿐**입니다.
- `index.html`에서 `fonts.css`를 `style.css`보다 **먼저** 불러옵니다.

---

## 3. 디자인 토큰 (`style.css` 맨 위 `:root`)

"토큰"은 색·크기 같은 디자인 값에 이름을 붙여 둔 것입니다. **`style.css`에서 색상은 반드시 이 변수로만** 사용합니다.

```css
:root {
  /* ── 배경·표면 ── */
  --color-bg: #121212;            /* 페이지 배경 (가장 깊은 층) */
  --color-surface: #181818;       /* 카드 */
  --color-surface-raised: #1f1f1f;/* 입력창, 어두운 버튼 */
  --color-surface-hover: #252525; /* 어두운 버튼 hover */

  /* ── 글자 ── */
  --color-text: #ffffff;          /* 기본 글자 */
  --color-text-muted: #b3b3b3;    /* 보조 글자, 안내 */
  --color-text-subtle: #7c7c7c;   /* 가장 약한 글자 (플레이스홀더) */
  --color-text-on-accent: #000000;/* 초록 버튼 위 글자 */

  /* ── 브랜드·상태 ── */
  --color-accent: #1ed760;        /* 브랜드 초록: 주 버튼, 긍정 */
  --color-accent-hover: #3be477;  /* 주 버튼 hover */
  --color-positive: #1ed760;      /* 긍정 */
  --color-negative: #f3727f;      /* 부정, 오류 */
  --color-neutral: #cbcbcb;       /* 중립 */
  --color-negative-bg: rgba(243, 114, 127, 0.08);  /* 오류 카드 배경 */
  --color-negative-line: rgba(243, 114, 127, 0.4); /* 오류 카드 안쪽 테두리 */

  /* ── 선 ── */
  --color-line: #4d4d4d;          /* 막대 바탕, 스피너 바탕 */
  --color-line-strong: #7c7c7c;   /* 입력창·외곽선 버튼 안쪽 테두리 */

  /* ── 그림자 ── */
  --shadow-card: rgba(0, 0, 0, 0.3) 0px 8px 8px;
  --shadow-heavy: rgba(0, 0, 0, 0.5) 0px 8px 24px;
  --shadow-inset-line: inset 0 0 0 1px var(--color-line-strong);
  --shadow-inset-focus: inset 0 0 0 1px var(--color-text);

  /* ── 모서리 ── */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-pill: 9999px;
  --radius-circle: 50%;

  /* ── 간격 (8px 기준) ── */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* ── 글꼴 ── */
  --font-sans: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo',
    'Malgun Gothic', 'Noto Sans KR', sans-serif;

  /* ── 움직임 ── */
  --duration-fast: 150ms;
  --duration-bar: 600ms;
  --easing: cubic-bezier(0.3, 0, 0.4, 1);

  /* ── 레이아웃 ── */
  --content-max: 720px;
}
```

---

## 4. 글자 단계 (Typography)

| 역할 | 크기 | 굵기 | 줄 간격 | 자간 | 색 | 사용 위치 |
|---|---|---|---|---|---|---|
| 페이지 제목 | 24px | 700 | 1.3 | -0.2px | `--color-text` | `#page-title` |
| 결과 판정 | 24px | 700 | 1.2 | -0.2px | 판정 색 | `#result-label` |
| 로고 텍스트 | 16px | 700 | 1 | 0 | `--color-text` | 헤더 |
| 본문 굵게 | 16px | 700 | 1.4 | 0 | `--color-text` | 신뢰도 값, 오류 제목 |
| 본문 | 16px | 400 | 1.5 | 0 | `--color-text` | 입력창 글자 |
| 분석 이유 | 16px | 400 | **1.6** | 0 | `--color-text` | `#result-reason` |
| 설명 | 14px | 400 | 1.5 | 0 | `--color-text-muted` | 제목 아래 설명, 빈 상태 문구 |
| 버튼 | 14px | 700 | 1 | 0.2px | 버튼별 | 모든 버튼 |
| 섹션 라벨 | 12px | 700 | 1.5 | 0.4px | `--color-text-muted` | "분석할 텍스트", "분석 결과", "신뢰도", "분석 이유", "예시" |
| 보조 | 12px | 400 | 1.5 | 0 | `--color-text-muted` | 글자 수, 안내 문구 |
| 입력 오류 | 12px | 600 | 1.5 | 0 | `--color-negative` | `#input-error` |

- `body`: `font-family: var(--font-sans); background: var(--color-bg); color: var(--color-text); -webkit-font-smoothing: antialiased;`
- 숫자(신뢰도 %, 글자 수)는 `font-variant-numeric: tabular-nums;`로 폭을 고정합니다.
- 기본 여백 초기화: `*, *::before, *::after { box-sizing: border-box; }`, `body, h1, p { margin: 0; }`
- 섹션 라벨 `.section-label`: `display: block; margin-bottom: var(--space-2);` 단, 예시 줄 안의 라벨은 `.example-row .section-label { margin: 0 var(--space-1) 0 0; }`
- 신뢰도 줄 안의 라벨은 `.confidence-head .section-label { margin-bottom: 0; }`, 신뢰도 줄과 막대 사이 간격은 `--space-2`

---

## 5. 레이아웃

### 5.1 전체 구조
- `<main>`은 가로 가운데 정렬, 최대 너비 `--content-max`(720px), 좌우 여백 `--space-6`(24px)
- 위에서부터: 헤더 → 제목 영역 → 입력 카드 → 결과 영역
- 세로 간격: 헤더 아래 `--space-10`, 제목 영역 아래 `--space-6`, 입력 카드와 결과 영역 사이 `--space-6`, 페이지 맨 아래 여백 `--space-12`

### 5.2 와이어프레임 (데스크톱)

```
                 ←──────────── 최대 720px ────────────→
┌────────────────────────────────────────────────────────┐
│  ●  감성 분석기                                          │ 헤더 높이 64px
│                                                        │
│  텍스트의 감정을 분석해 보세요                              │ 24px / 700
│  문장을 입력하면 AI가 긍정·부정·중립을 판단하고 이유를 알려줘요 │ 14px / muted
│                                                        │
│  ┌─ 입력 카드 (#181818, radius 8, padding 24) ─────────┐ │
│  │ 분석할 텍스트                                       │ │ 섹션 라벨
│  │ ┌─────────────────────────────────────────────┐   │ │
│  │ │ 분석할 문장을 입력해 주세요                     │   │ │ textarea 최소 높이 160px
│  │ │                                             │   │ │
│  │ └─────────────────────────────────────────────┘   │ │
│  │ (입력 오류 문구 · 빨강)                 0 / 1000   │ │
│  │                                                   │ │
│  │ 예시  (선물 후기) (배송 불만) (회의 안내)              │ │ 어두운 알약 버튼
│  │                                                   │ │
│  │                          ( 지우기 ) (  분석하기  )  │ │ 오른쪽 정렬
│  └───────────────────────────────────────────────────┘ │
│                                                        │
│  ┌─ 결과 영역 (상태에 따라 4가지 중 하나 표시) ──────────┐ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

## 6. 컴포넌트 명세

### 6.1 헤더 `.site-header`
- 높이 64px, `display: flex; align-items: center; gap: var(--space-2)`
- 로고 점 `.logo-dot`: 지름 12px 원, 배경 `--color-accent`, `aria-hidden="true"`
- 로고 텍스트 "감성 분석기": 16px / 700

### 6.2 제목 영역
- `#page-title` "텍스트의 감정을 분석해 보세요" (h1, 24px/700, 아래 여백 `--space-2`)
- `.page-desc` "문장을 입력하면 AI가 긍정·부정·중립을 판단하고 이유를 알려줘요." (14px/400/muted)

### 6.3 카드 공통 `.card`
- 배경 `--color-surface`, 모서리 `--radius-md`, 안쪽 여백 `--space-6`, 그림자 `--shadow-card`
- 테두리 없음

### 6.4 입력창 `#text-input` (textarea)
| 속성 | 값 |
|---|---|
| 배경 | `--color-surface-raised` |
| 글자 | 16px / 400 / `--color-text`, 줄 간격 1.5 |
| 플레이스홀더 | "분석할 문장을 입력해 주세요", 색 `--color-text-subtle` |
| 안쪽 여백 | `--space-4` |
| 모서리 | `--radius-md` |
| 테두리 | `border: none; box-shadow: var(--shadow-inset-line);` |
| 크기 | 너비 100%, `min-height: 160px`, `resize: vertical` |
| 포커스 | `outline: none; box-shadow: var(--shadow-inset-focus);` |
| 초과 상태 (`.is-invalid`) | `box-shadow: inset 0 0 0 1px var(--color-negative);` |
| 읽기 전용(로딩 중) | `opacity: 0.6` |

### 6.5 입력창 아래 줄 `.input-meta`
- `display: flex; justify-content: space-between; margin-top: var(--space-2)`
- 왼쪽 `#input-error`: 입력 오류 문구 (12px/600/negative). 오류가 없으면 빈 문자열(요소는 유지)
- 오른쪽 `#char-count`: `0 / 1000` (12px/400/muted, tabular-nums). 초과 시 클래스 `.is-over` → 색 `--color-negative`, 굵기 700

### 6.6 예시 영역 `.example-row`
- `margin-top: var(--space-5)`, `display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2)`
- 맨 앞 라벨 "예시" (섹션 라벨 스타일)
- 예시 버튼 `.btn-chip` 3개 (§6.7 어두운 알약)

### 6.7 버튼 3종 — 전부 알약 모양

공통 `.btn`: `font: 700 14px/1 var(--font-sans); letter-spacing: 0.2px; border: none; border-radius: var(--radius-pill); cursor: pointer; transition: transform var(--duration-fast) var(--easing), background-color var(--duration-fast) var(--easing);`

| 클래스 | 용도 | 배경 | 글자색 | 안쪽 여백 | hover | 비활성(`:disabled`) |
|---|---|---|---|---|---|---|
| `.btn-primary` | 분석하기 | `--color-accent` | `--color-text-on-accent` | 14px 32px | 배경 `--color-accent-hover`, `transform: scale(1.04)` | `opacity: 0.5; cursor: not-allowed; transform: none` |
| `.btn-outline` | 지우기 | 투명 | `--color-text` | 13px 24px | `box-shadow: inset 0 0 0 1px var(--color-text)` | `opacity: 0.5; cursor: not-allowed` |
| `.btn-chip` | 예시, 다시 시도 | `--color-surface-raised` | `--color-text` | 8px 16px | 배경 `--color-surface-hover` | `opacity: 0.5; cursor: not-allowed` |

- `.btn-outline` 기본 테두리: `box-shadow: var(--shadow-inset-line)`
- `.btn-chip`의 글자 굵기는 600으로 덮어쓰고, 최소 높이를 지정합니다 (`font-weight: 600; min-height: 36px;`)
- 버튼 줄 `.action-row`: `margin-top: var(--space-6); display: flex; justify-content: flex-end; gap: var(--space-3)`
- 모든 버튼 `:focus-visible`: `outline: 2px solid var(--color-text); outline-offset: 2px;`

### 6.8 결과 영역 `#result-section` — 4가지 상태

결과 영역 안에는 아래 4개 블록이 모두 HTML에 들어 있고, **한 번에 하나만** 보입니다(나머지는 `hidden` 속성).

#### ① 빈 상태 `#result-empty` (처음 화면)
- `.card` 스타일, `min-height: 140px`, 내용 가운데 정렬
- 문구: "텍스트를 입력하고 분석하기를 눌러 주세요." (14px/muted)

#### ② 로딩 `#result-loading`
- `.card` 스타일, `min-height: 140px`, 가로·세로 가운데 정렬, 요소 간격 `--space-3`
- 스피너 `.spinner`: 지름 24px 원, `border: 3px solid var(--color-line); border-top-color: var(--color-accent); border-radius: var(--radius-circle); animation: spin 800ms linear infinite;`
- 문구: "분석 중이에요…" (14px/muted)

#### ③ 결과 카드 `#result-card`
```
┌──────────────────────────────────────────┐
│ 분석 결과                                  │ 섹션 라벨
│ ● 부정                                     │ 점 12px 원 + 24px/700, 판정 색
│                                          │
│ 신뢰도                              92%   │ 섹션 라벨 / 16px 700
│ ████████████████████████░░░              │ 막대 높이 6px
│                                          │
│ 분석 이유                                  │ 섹션 라벨
│ '실망했어요'라는 표현에서 불만이 드러나요.      │ 16px/400/1.6
│ ──────────────────────────────────────── │ 구분 여백
│ AI가 추정한 결과로, 정확하지 않을 수 있어요.    │ 12px/muted
└──────────────────────────────────────────┘
```
- 카드: `.card`
- 블록 간 간격: `--space-6`, 라벨과 내용 간격: `--space-2`
- 판정 줄 `.result-label-row`: `display: flex; align-items: center; gap: var(--space-2)`
  - 점 `.result-dot`: 지름 12px 원, 배경 = 판정 색
  - `#result-label`: 판정 텍스트, 글자색 = 판정 색
- 판정 색은 카드에 붙는 클래스로 정합니다
  | 카드 클래스 | 판정 색 변수 |
  |---|---|
  | `.is-positive` | `--color-positive` |
  | `.is-negative` | `--color-negative` |
  | `.is-neutral` | `--color-neutral` |
  - 구현: 카드에 `--result-color`를 지정하고(`.is-positive { --result-color: var(--color-positive); }`), 점·라벨·막대가 `var(--result-color)`를 사용
- 신뢰도 줄 `.confidence-head`: `display: flex; justify-content: space-between; align-items: baseline`
  - `#confidence-value`: `92%` (16px/700/text, tabular-nums)
- 막대 `#confidence-bar` (바탕): 높이 6px, 배경 `--color-line`, 모서리 `--radius-pill`, `overflow: hidden`
- 막대 채움 `#confidence-fill`: 높이 100%, 배경 `var(--result-color)`, 모서리 `--radius-pill`, `width`를 JS로 `%` 지정, `transition: width var(--duration-bar) var(--easing)`
- `#result-reason`: 16px/400/1.6/text
- 안내 `.result-note`: 맨 아래, 위 여백 `--space-6`, 12px/muted, 문구 "AI가 추정한 결과로, 정확하지 않을 수 있어요."

#### ④ 오류 카드 `#error-box`
- 배경 `--color-negative-bg`, `box-shadow: inset 0 0 0 1px var(--color-negative-line)`, 모서리 `--radius-md`, 안쪽 여백 `--space-6`, 그림자 없음
- 제목 `.error-title` "분석하지 못했어요" (16px/700/negative)
- `#error-message`: 오류 문구 (14px/400/text, 위 여백 `--space-2`)
- `#retry-button` "다시 시도" (`.btn .btn-chip`, 위 여백 `--space-4`). 다시 시도 가능한 오류일 때만 보임

---

## 7. 움직임 (애니메이션)

이 문서에 있는 3가지 외의 애니메이션은 추가하지 않습니다.

| 대상 | 효과 |
|---|---|
| `.btn-primary` hover | `scale(1.04)`, 150ms |
| `#confidence-fill` | 너비 0% → 값, 600ms (결과 표시 직후 시작) |
| `.spinner` | 800ms 1회전 무한 반복 |

```css
@keyframes spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. 반응형

| 화면 폭 | 변경 사항 |
|---|---|
| 577px 이상 | 기본(§5~§6) |
| **576px 이하** | ① `main` 좌우 여백 `--space-4` ② 카드 안쪽 여백 `--space-5` ③ 페이지 제목 20px ④ 결과 판정 20px ⑤ `.action-row`는 세로 배치(`flex-direction: column-reverse`)로 **분석하기가 위**, 지우기가 아래, 두 버튼 모두 너비 100% |

- 320px 폭에서 가로 스크롤이 생기면 안 됩니다.
- 미디어 쿼리는 `@media (max-width: 576px)` **하나만** 사용합니다.

---

## 9. 접근성

- 대비: 기본 글자 `#ffffff`/`#b3b3b3`는 `#121212`·`#181818` 배경에서 WCAG AA 기준을 충족합니다. 다른 조합을 만들지 않습니다.
- 판정은 **색 + 글자(긍정/부정/중립)** 로 함께 표시합니다.
- 포커스 표시를 제거하지 않습니다 (§6.7 `:focus-visible`).
- 클릭 가능한 요소는 최소 높이 36px를 유지합니다(`.btn-chip` 포함).

---

## 10. 완료 기준

- [ ] `style.css`의 `:root`가 §3과 동일하다 (추가 변수는 허용하지 않음)
- [ ] `:root` 바깥에 `#`으로 시작하는 색상 코드가 0건이다 (`rgba()` 직접 사용도 0건)
- [ ] `border: 1px solid` 형태의 회색 테두리가 0건이다
- [ ] 모든 버튼의 `border-radius`가 `var(--radius-pill)`이다
- [ ] 초록색(`--color-accent`, `--color-positive`)이 쓰인 곳이 §1 "초록색은 기능에만" 목록 범위 안이다
- [ ] 576px 이하에서 §8 변경 사항이 모두 적용된다
- [ ] 개발자도구 Network 탭에서 `Pretendard-Regular.woff2`, `Pretendard-SemiBold.woff2`, `Pretendard-Bold.woff2`가 로드된다

---

## 변경 이력
- 2026-11-23: 최초 작성
