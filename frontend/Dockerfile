FROM node:20-alpine

WORKDIR /app

# 의존성 파일 먼저 복사 (캐싱 활용)
COPY package.json ./

# 패키지 설치
RUN npm install

# 나머지 소스 코드 복사
COPY . .

# Vite 기본 포트 개방
EXPOSE 5173

# 프론트엔드 서버 실행
CMD ["npm", "run", "dev"]