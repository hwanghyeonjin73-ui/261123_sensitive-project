# 감성 분석기 (Sentiment Analyzer)

문장을 입력하면 AI가 긍정·부정·중립을 판정하고, 얼마나 확신하는지와 그 이유를 알려주는 웹 서비스입니다.

## 1. 준비물
- Node.js 24 이상 (LTS 권장)
- npm
- OpenAI API 키 ([platform.openai.com](https://platform.openai.com)에서 발급)

## 2. 로컬 실행 방법
1. 저장소 최상단에 `.env` 파일을 생성하고 발급받은 API 키를 입력합니다.
   ```dotenv
   OPENAI_API_KEY=sk-...
   OPENAI_MODEL=
   ```
2. 패키지를 설치합니다:
   ```bash
   npm install
   ```
3. 로컬 개발 서버를 실행합니다:
   ```bash
   npm run dev
   ```
4. 브라우저에서 `http://localhost:3000`으로 접속합니다.

## 3. 테스트 방법
Node.js 내장 테스트 러너를 통해 인터넷 연결 및 API 키 없이 테스트를 수행합니다:
```bash
npm test
```

## 4. 배포 방법
Vercel을 통해 배포할 수 있습니다. 자세한 내용은 [docs/06-deployment.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/sentiment_project/sentiment-docs/docs/06-deployment.md)를 참고하세요.

## 5. 문서 안내
- [AGENTS.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/sentiment_project/sentiment-docs/AGENTS.md): AI 에이전트 작업 규칙
- [PRD.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/sentiment_project/sentiment-docs/PRD.md): 제품 요구사항 명세
- [docs/01-project-setup.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/sentiment_project/sentiment-docs/docs/01-project-setup.md): 프로젝트 설정 지침
- [docs/02-ui-design.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/sentiment_project/sentiment-docs/docs/02-ui-design.md): UI 디자인 지침
- [docs/03-frontend.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/sentiment_project/sentiment-docs/docs/03-frontend.md): 프론트엔드 기능 지침
- [docs/04-backend-api.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/sentiment_project/sentiment-docs/docs/04-backend-api.md): 백엔드 및 AI 연동 지침
- [docs/05-error-handling.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/sentiment_project/sentiment-docs/docs/05-error-handling.md): 오류 처리 기준표
- [docs/06-deployment.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/sentiment_project/sentiment-docs/docs/06-deployment.md): Vercel 배포 지침
- [docs/07-testing.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/sentiment_project/sentiment-docs/docs/07-testing.md): 검증 기준 및 테스트 시나리오
