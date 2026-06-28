import { useCallback, useMemo, useState } from 'react';
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
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
}

function removeStoredAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function useAuth(): UseAuthResult {
  const [accessToken, setAccessToken] = useState<string | null>(() => getStoredAccessToken());
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = useMemo(() => Boolean(accessToken), [accessToken]);

  const login = useCallback(async (payload: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(payload);
      setStoredAccessToken(response.access_token);
      setAccessToken(response.access_token);
      return response;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    setIsLoading(true);
    try {
      return await authService.register(payload);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    removeStoredAccessToken();
    setAccessToken(null);
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
