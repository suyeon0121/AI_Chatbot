import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';
import apiClient from './apiClient';

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const formData = new URLSearchParams();
  formData.set('username', payload.email);
  formData.set('password', payload.password);

  const { data } = await apiClient.post<AuthResponse>('/api/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return data;
}

export async function register(payload: RegisterRequest): Promise<User> {
  const { data } = await apiClient.post<User>('/api/auth/register', payload);
  return data;
}
