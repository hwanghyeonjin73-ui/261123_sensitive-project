# 06. Vercel 배포 지침

> 내 컴퓨터에서 만든 서비스를 인터넷 주소로 공개하는 방법입니다.
> **배포 버튼 클릭과 API 키 입력은 사용자가 직접** 합니다. AI 에이전트는 이 문서대로 안내하고, 배포 전 점검(§1)만 수행합니다.

---

## 1. 배포 전 점검 (에이전트 수행)

- [ ] `npm test` 실패 0건
- [ ] `docs/07` 화면 테스트 T-01 ~ T-18 통과 (로컬)
- [ ] `.gitignore`에 `.env`가 있고, `git status`에 `.env`가 보이지 않는다
- [ ] 프로젝트 전체에서 `sk-` 문자열 검색 시 `.env` 외 결과 0건
- [ ] `vercel.json`이 `docs/01` §3.5와 같다
- [ ] `package.json`에 `build` 스크립트가 없다
- [ ] `package-lock.json`이 있다 (Vercel이 같은 버전을 설치하게 함)

---

## 2. 배포 구조 (어떻게 올라가나요?)

| 내 프로젝트 | Vercel에서 | 주소 |
|---|---|---|
| `public/index.html` 등 | 정적 파일로 바로 전달 | `https://<프로젝트>.vercel.app/` |
| `api/analyze.js` | 서버 함수(Vercel Function) | `https://<프로젝트>.vercel.app/api/analyze` |
| `lib/` | `api/analyze.js`에 함께 묶여 서버에서만 실행 | 외부에서 접근 불가 |
| `dev-server.js`, `tests/`, `docs/` | 사용되지 않음 | 외부에서 접근 불가 |
| `.env` | **올라가지 않음** | — (Vercel 환경변수로 따로 입력) |

---

## 3. 방법 A — GitHub 연결 배포 (권장)

코드를 GitHub에 올리면 Vercel이 자동으로 배포하고, 이후 코드를 올릴 때마다 자동 재배포됩니다.

### 3.1 GitHub에 올리기
```bash
git init
git add .
git commit -m "감성 분석 서비스 초기 버전"
git branch -M main
git remote add origin https://github.com/<내아이디>/sentiment-analyzer.git
git push -u origin main
```
> 저장소는 GitHub 웹사이트에서 **먼저** 빈 저장소로 만들어 둡니다(README 추가 체크 해제).

### 3.2 Vercel에서 프로젝트 만들기
1. https://vercel.com 로그인 → **Add New… → Project**
2. GitHub 저장소 목록에서 `sentiment-analyzer` → **Import**
3. 설정 화면에서 아래처럼 확인합니다.

| 항목 | 값 |
|---|---|
| Framework Preset | **Other** |
| Root Directory | `./` (기본값) |
| Build Command | 비워 둠 (Override 끔) |
| Output Directory | `public` (vercel.json에서 자동 적용) |
| Install Command | 기본값 (`npm install`) |

4. **Environment Variables** 항목을 펼쳐 입력합니다.

| Key | Value |
|---|---|
| `OPENAI_API_KEY` | `sk-...` (내 API 키) |
| `OPENAI_MODEL` | 비워 두거나 입력하지 않음 (기본 `gpt-6-luna`) |

5. **Deploy** 클릭 → 1~2분 후 배포 주소가 나옵니다.

### 3.3 환경변수를 나중에 바꿀 때
1. Vercel 프로젝트 → **Settings → Environment Variables**
2. 값 수정 후 저장
3. **Deployments** 탭 → 최신 배포의 `…` 메뉴 → **Redeploy**
> ⚠️ 환경변수는 **재배포해야** 적용됩니다.

---

## 4. 방법 B — Vercel CLI 배포 (선택)

GitHub 없이 터미널에서 바로 올리는 방법입니다.

```bash
npx vercel login          # 브라우저에서 로그인
npx vercel                # 미리보기(Preview) 배포 — 질문에는 기본값으로 답함
npx vercel env add OPENAI_API_KEY production   # 키 입력
npx vercel --prod         # 실제(Production) 배포
```

---

## 5. 비용·안전 설정 (사용자 수행 권장)

| 설정 | 위치 | 이유 |
|---|---|---|
| 월 사용 한도(Usage limit) 설정 | OpenAI 대시보드의 결제·한도 설정 | 누군가 과도하게 사용해도 요금이 한도 이상 나가지 않음 |
| 이 서비스 전용 API 키 발급 | OpenAI 대시보드 API keys | 문제가 생기면 이 키만 삭제하면 됨 |
| 키 유출 시 | 즉시 OpenAI에서 키 삭제 → 새 키 발급 → Vercel 환경변수 교체 → Redeploy | — |

> 서버 측 요청 횟수 제한은 이번 범위 밖입니다(PRD §6.2). 공개 주소를 널리 공유하기 전에는 위 사용 한도 설정을 꼭 해 두세요.

---

## 6. 배포 후 확인

배포 주소에서 `docs/07-testing.md` §5 "배포 후 검증"을 모두 수행합니다.

### 6.1 자주 생기는 문제

| 증상 | 원인 | 해결 |
|---|---|---|
| 화면이 404 | Output Directory가 `public`이 아님 | `vercel.json` 확인 후 재배포 |
| 분석 시 "서버 설정에 문제가 있어요." | 환경변수 미입력 또는 재배포 안 함 | §3.3 순서대로 입력 후 Redeploy |
| 분석 시 "서비스 사용 한도에 도달했어요." | OpenAI 잔액·한도 소진 | OpenAI 대시보드에서 결제·한도 확인 |
| 글꼴이 기본 글꼴로 보임 | CDN 차단 또는 `fonts.css` 경로 오류 | 개발자도구 Network 탭에서 woff2 로드 확인 |
| 로그 확인이 필요함 | — | Vercel 프로젝트 → **Logs** 탭에서 `[analyze]`로 검색 |

---

## 7. 완료 기준

- [ ] 배포 주소(`https://<프로젝트>.vercel.app`)에서 화면이 열린다
- [ ] `docs/07` §5 배포 후 검증 D-01 ~ D-06 통과
- [ ] Vercel 환경변수에 `OPENAI_API_KEY`가 있고, GitHub 저장소에는 `.env`가 없다

---

## 변경 이력
- 2026-11-23: 최초 작성
