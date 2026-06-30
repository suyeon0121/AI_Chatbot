import { useCallback, useMemo, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { ACCESS_TOKEN_STORAGE_KEY } from '../services/apiClient';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';

interface UseAuthResult {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<AuthResponse>;
  logout: () => void;
  register: (payload: RegisterRequest) => Promise<User>;
}

function getStoredAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function setStoredAccessToken(token: string): void {
  try {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.error('토큰 저장 실패 (LocalStorage 용량 초과 등):', error);
  }
}

function removeStoredAccessToken(): void {
  try {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('토큰 삭제 실패:', error);
  }
}

export function useAuth(): UseAuthResult {
  const [accessToken, setAccessToken] = useState<string | null>(() => getStoredAccessToken());
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = useMemo(() => Boolean(accessToken), [accessToken]);

  // 1. 다중 탭 환경 대응: 다른 탭에서 로그아웃하거나 로그인했을 때 상태 동기화
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ACCESS_TOKEN_STORAGE_KEY) {
        setAccessToken(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(payload);
      setStoredAccessToken(response.access_token);
      setAccessToken(response.access_token);
      return response;
    } catch (error) {
      // 2. 에러 핸들링: 실패 시 상위 컴포넌트(Form 등)에서 catch할 수 있도록 throw하되, 
      // 필요한 공통 에러 로깅이나 처리를 여기서 수행합니다.
      console.error('로그인 에러:', error);
      throw error; 
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    setIsLoading(true);
    try {
      return await authService.register(payload);
    } catch (error) {
      console.error('회원가입 에러:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    removeStoredAccessToken();
    setAccessToken(null);
    
    // 3. 로그아웃 후 안전한 후속 조치 (선택 사항)
    // 인증 기반 캐시나 상태를 완전히 비워주기 위해 페이지를 새로고침하거나 
    // 전역 상태(예: 전역 유저 정보 스토어)를 초기화하는 코드를 여기에 배치합니다.
    // window.location.href = '/login'; 
  }, []);

  return {
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
  };
}