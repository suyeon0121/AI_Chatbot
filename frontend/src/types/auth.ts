export interface User {
  id: number;
  email: string;
  nickname: string;
  is_active: boolean;
  // 1. 실제 서비스 확장 시 자주 추가되는 유저 메타데이터 분기 미리 고려
  profile_image_url?: string | null; // 프로필 이미지 (없을 수 있으므로 옵셔널 + null 허용)
  created_at: string;                // 계정 생성일 (ISO 8601 문자열)
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  // 2. 토큰과 함께 유저 기본 정보가 한 번에 내려오는 백엔드 명세 대응 (선택)
  // 로그인 성공 시점에 전역 스토어(Context, Zustand 등)에 유저 정보를 바로 담을 때 매우 유용합니다.
  user?: User; 
}