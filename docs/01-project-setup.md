# 01. 프로젝트 생성 지침

> 이 문서는 프로젝트 폴더를 만들고, 설정 파일을 작성하고, 내 컴퓨터에서 실행해 보는 방법을 설명합니다.
> AGENTS.md의 **Step 1**과 **Step 3(로컬 서버 부분)** 에 해당합니다.

---

## 1. 사전 준비물

| 준비물 | 설명 | 확인 방법 |
|---|---|---|
| Node.js **24 이상** (LTS 권장) | 서버 코드를 실행하는 프로그램. https://nodejs.org 에서 LTS 버전 설치 | 터미널에서 `node -v` → `v24.x.x` 이상 |
| npm | Node.js 설치 시 함께 설치됨 | `npm -v` |
| Git | 코드 버전 관리, GitHub 업로드용 | `git --version` |
| OpenAI API 키 | https://platform.openai.com 에서 결제 수단 등록 후 API keys 메뉴에서 발급 (`sk-`로 시작) | 키를 안전한 곳에 보관 |
| GitHub 계정 | 코드 저장소 (배포에 사용) | — |
| Vercel 계정 | 배포 서비스. GitHub 계정으로 가입 가능 | — |

> 💡 **비전공자 팁**: "터미널"은 Windows에서는 *PowerShell*, Mac에서는 *터미널* 앱입니다. Antigravity IDE 안에도 터미널 창이 있습니다.

---

## 2. 폴더 구조 (정확히 이 구조로 만든다)

```
sentiment-analyzer/
├── AGENTS.md                 # 에이전트 작업 규칙 (이미 있음)
├── PRD.md                    # 제품 요구사항 (이미 있음)
├── README.md                 # 실행·배포 방법 요약 (Step 1에서 작성)
├── docs/                     # 세부 구현 문서 (이미 있음)
│
├── public/                   # ▶ 브라우저에 그대로 전달되는 파일 (정적 파일)
│   ├── index.html            #   유일한 화면
│   ├── favicon.svg           #   브라우저 탭 아이콘
│   ├── css/
│   │   ├── fonts.css         #   Pretendard @font-face 정의
│   │   └── style.css         #   디자인 토큰 + 전체 스타일
│   └── js/
│       ├── config.js         #   상수, 문구, 예시 문장
│       ├── api.js            #   서버 호출 함수
│       └── app.js            #   화면 동작 (진입점)
│
├── api/                      # ▶ Vercel Function (서버 진입점)
│   └── analyze.js            #   POST /api/analyze
│
├── lib/                      # ▶ 서버 핵심 로직 (브라우저에 노출되지 않음)
│   ├── errors.js             #   오류 코드 정의, AppError
│   ├── validate.js           #   입력 검증
│   ├── normalize.js          #   AI 응답 검증·변환
│   ├── prompt.js             #   시스템 프롬프트, JSON Schema
│   └── sentiment.js          #   OpenAI 호출
│
├── tests/                    # ▶ 자동 테스트 (node:test)
│   ├── validate.test.js
│   ├── normalize.test.js
│   └── api.test.js
│
├── dev-server.js             # 로컬 개발 전용 서버 (배포에는 사용 안 됨)
├── package.json
├── package-lock.json         # npm install 시 자동 생성
├── vercel.json
├── .env.example              # 환경변수 이름 예시 (커밋 O)
├── .env                      # 실제 API 키 (커밋 X, 직접 만듦)
└── .gitignore
```

**왜 이렇게 나누나요?**
- `public/`은 누구나 볼 수 있는 파일입니다. 그래서 비밀(API 키)이 절대 들어가면 안 됩니다.
- `api/`와 `lib/`는 서버에서만 실행되므로 API 키를 읽을 수 있습니다.
- `api/`에는 **`analyze.js` 하나만** 둡니다. Vercel은 `api/` 안의 파일마다 서버 함수를 하나씩 만들기 때문에, 보조 코드는 `lib/`에 둡니다.

---

## 3. 설정 파일 내용

### 3.1 `package.json`

```json
{
  "name": "sentiment-analyzer",
  "version": "1.0.0",
  "private": true,
  "description": "텍스트 감성 분석 서비스",
  "type": "module",
  "engines": {
    "node": ">=24"
  },
  "scripts": {
    "dev": "node --env-file-if-exists=.env dev-server.js",
    "test": "node --test"
  },
  "dependencies": {}
}
```

- `dependencies`는 비워 두고, 아래 명령으로 `openai`를 설치합니다. 버전 번호를 **직접 적지 않습니다** (설치 시 최신 버전이 자동 기록됨).
  ```bash
  npm install openai
  ```
- `"type": "module"`: `import/export` 문법을 쓰겠다는 표시입니다.
- `--env-file-if-exists=.env`: `.env` 파일의 값을 환경변수로 읽어 옵니다(Node.js 내장 기능, 추가 패키지 불필요).
- `node --test`: 프로젝트 안의 `*.test.js` 파일을 자동으로 찾아 실행합니다.
- `build` 스크립트는 **만들지 않습니다** (빌드 과정 없음).

### 3.2 `.gitignore`

```gitignore
node_modules/
.env
.env.*
!.env.example
.vercel/
.DS_Store
Thumbs.db
```

### 3.3 `.env.example`

```dotenv
# OpenAI API 키 (필수). https://platform.openai.com 에서 발급
OPENAI_API_KEY=

# 사용할 모델 (선택). 비워 두면 gpt-6-luna 사용
OPENAI_MODEL=
```

### 3.4 `.env` (사용자가 직접 만듦, 커밋 금지)

`.env.example`을 복사해 `.env`로 이름을 바꾸고 값을 채웁니다.

```dotenv
OPENAI_API_KEY=sk-여기에_발급받은_키
OPENAI_MODEL=
```

> ⚠️ 에이전트는 `.env` 파일을 만들거나 키 값을 대신 입력하지 않습니다. 사용자에게 위 방법을 안내만 합니다.

### 3.5 `vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "outputDirectory": "public",
  "functions": {
    "api/analyze.js": {
      "maxDuration": 30
    }
  }
}
```

- `outputDirectory: "public"`: 화면 파일이 `public` 폴더에 있다고 알려 줍니다.
- `maxDuration: 30`: 서버 함수가 최대 30초까지 실행될 수 있게 합니다(AI 대기 20초 + 여유).

### 3.6 `public/favicon.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#1ed760"/></svg>
```

### 3.7 `README.md` (에이전트가 작성)

아래 목차로 짧게 작성합니다(각 항목 3~6줄).
1. 프로젝트 소개 (PRD.md §1 한 줄 소개 인용)
2. 준비물 (이 문서 §1 요약)
3. 로컬 실행 방법 (이 문서 §5)
4. 테스트 방법 (`npm test`)
5. 배포 방법 (`docs/06-deployment.md` 링크)
6. 문서 안내 (PRD.md §11 표 링크)

---

## 4. 처음부터 만드는 명령어 순서

```bash
# 1) 프로젝트 폴더로 이동 (AGENTS.md, PRD.md, docs/ 가 있는 폴더)
cd sentiment-analyzer

# 2) package.json 작성 (§3.1 내용) 후 openai 설치
npm install openai

# 3) 폴더 만들기
mkdir -p public/css public/js api lib tests
```

> Windows PowerShell에서는 `mkdir -p` 대신 폴더를 하나씩 만들거나 IDE 파일 탐색기에서 만듭니다.

---

## 5. 내 컴퓨터에서 실행하기

```bash
npm run dev
```

터미널에 `로컬 서버 실행 중: http://localhost:3000` 이 보이면 브라우저에서 그 주소로 접속합니다. 끄려면 터미널에서 `Ctrl + C`.

---

## 6. 로컬 개발 서버 `dev-server.js` (참고 구현)

Vercel에 올리면 Vercel이 `public/`과 `api/`를 알아서 연결해 주지만, 내 컴퓨터에는 그 기능이 없습니다. 그래서 **같은 동작을 흉내 내는 작은 서버**를 Node.js 기본 기능만으로 만듭니다. 아래 코드를 그대로 사용합니다.

```js
// dev-server.js — 로컬 개발 전용 서버입니다. Vercel 배포에는 사용되지 않습니다.
// public/ 폴더의 파일을 보여 주고, /api/analyze 요청은 api/analyze.js로 넘깁니다.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import handler from './api/analyze.js';

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = resolve('public');
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

// 요청 본문을 끝까지 읽어 Buffer로 돌려줍니다.
async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

// Node.js 요청을 Web 표준 Request로 바꿔 Vercel과 같은 방식으로 핸들러를 호출합니다.
async function handleApi(req, res, url) {
  const hasBody = !['GET', 'HEAD'].includes(req.method);
  const request = new Request(url, {
    method: req.method,
    headers: { 'content-type': req.headers['content-type'] ?? '' },
    body: hasBody ? await readBody(req) : undefined,
  });
  const response = await handler.fetch(request);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
}

async function handleStatic(res, url) {
  const pathname = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  const filePath = resolve(join(PUBLIC_DIR, pathname));
  // public 폴더 바깥 파일을 읽지 못하게 막습니다.
  if (!filePath.startsWith(PUBLIC_DIR + sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }
  const data = await readFile(filePath);
  res.writeHead(200, { 'Content-Type': MIME_TYPES[extname(filePath)] ?? 'application/octet-stream' });
  res.end(data);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname === '/api/analyze') {
      await handleApi(req, res, url);
    } else {
      await handleStatic(res, url);
    }
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }
    console.error('[dev-server]', error.message);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`로컬 서버 실행 중: http://localhost:${PORT}`);
});
```

---

## 7. 완료 기준

- [ ] §2 폴더 구조와 실제 파일 목록이 정확히 일치한다 (`.env`, `package-lock.json`, `node_modules/` 제외)
- [ ] `package.json`이 §3.1과 같고, `dependencies`에는 `openai` 하나만 있다
- [ ] `.gitignore`에 `.env`가 포함되어 있다
- [ ] `.env.example`에 키 이름만 있고 값은 비어 있다
- [ ] `npm run dev` 실행 후 `http://localhost:3000` 에서 화면이 열린다 (Step 4 이후 확인)
- [ ] `http://localhost:3000/../package.json` 같은 경로로 public 바깥 파일이 보이지 않는다

---

## 변경 이력
- 2026-11-23: 최초 작성
