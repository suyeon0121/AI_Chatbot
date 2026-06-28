import { useCallback, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import type { LoginRequest, RegisterRequest } from '../types/auth';

export function useAuth() {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'));
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = useMemo(() => Boolean(accessToken), [accessToken]);

  const login = useCallback(async (payload: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(payload);
      localStorage.setItem('accessToken', response.access_token);
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
    localStorage.removeItem('accessToken');
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
