import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';
import apiClient from './apiClient';

/**
 * 사용자 로그인을 요청합니다.
 * OAuth2 표준(Form Data) 명세에 맞추어 username(email)과 password를 전송합니다.
 */
export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const formData = new URLSearchParams();
  formData.set('username', payload.email);
  formData.set('password', payload.password);

  try {
    const { data } = await apiClient.post<AuthResponse>('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return data;
  } catch (error) {
    // 1. 서비스 레이어 수준에서의 로깅 및 예외 버블링 정돈
    console.error('authService.login 실패:', error);
    throw error;
  }
}

/**
 * 새로운 사용자의 회원가입을 요청합니다.
 * JSON 객체 형식으로 회원 정보를 전송합니다.
 */
export async function register(payload: RegisterRequest): Promise<User> {
  try {
    const { data } = await apiClient.post<User>('/api/auth/register', payload);
    return data;
  } catch (error) {
    console.error('authService.register 실패:', error);
    throw error;
  }
}