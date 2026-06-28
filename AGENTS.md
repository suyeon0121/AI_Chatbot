# AGENTS.md

## 규칙
- 커밋 메시지는 Conventional Commits 규격 준수
- 새 기능 추가 시 반드시 테스트 코드 작성

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