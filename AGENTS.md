# AGENTS.md

## 규칙
- 마지막에 커밋 메시지 Conventional Commits 규격 준수하며 한국어로 작성
- 새 기능 추가 시 반드시 테스트 코드 작성
- 새로운 기능을 구현하기 전에는 반드시 작업용 브랜치(`feature/...`)를 미리 생성할 것
- 작업을 시작하기 전 현재 Git 브랜치 위치를 확인하고, `main` 브랜치인 경우 사용자에게 브랜치 전환을 먼저 안내할 것

## 기술 스택
- **Frontend:** React, TypeScript
- **Backend:** Python, FastAPI
- **ORM & Validation:** SQLAlchemy, Pydantic
- **Database:** PostgreSQL
- **AI / LLM:** Local Serving (vLLM, SGLang, LM Studio) 또는 외부 LLM API 활용
- **Environment:** Docker, Docker Compose
- **DevOps:** GitHub Actions, Nginx
- **VCS:** Git, GitHub

## 지시 사항
- 코드를 생성할 때 위 기술 스택과 라이브러리 버전에 맞는 문법을 사용해줘.
- 데이터베이스 관련 코드는 무조건 SQLAlchemy 2.0와 Pydantic을 조합해서 작성해줘.
- `any` 타입 사용 금지
- 코드를 프로젝트에 즉시 반영하기 전에 변경된 파일 목록과 수정 내역(Diff)을 사용자에게 먼저 제시하고, 사용자가 최종 승인(Accept)을 하기 전까지는 실제 파일에 코드를 작성하거나 수정하지 마.
- 기능 구현 요청은 한 번에 화면 하나 또는 API 하나씩만 분할하여 순차적으로 진행하고, 사용자가 명시적으로 요청하지 않은 파일은 절대 새로 생성하거나 수정하지 마.

## 보안 규칙
- 비밀번호와 인증: 비밀번호는 해시(예: bcrypt)하여 저장하고, 로그인 후에는 토큰(JWT 등)으로 인증된 사용자임을 확인합니다. 인증이 필요한 기능은 로그인한 사용자만 접근합니다. 
- 비밀정보 관리: API 키 등 비밀 값은 환경 파일(.env)로 분리하고 .gitignore에 등록하여 저장소에 올라가지 않게 합니다. 
- AI 코딩 도구: 프롬프트에 API 키·비밀번호 등 비밀 값을 포함하지 않습니다.