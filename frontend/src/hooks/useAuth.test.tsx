/* @vitest-environment jsdom */

import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ACCESS_TOKEN_STORAGE_KEY } from '../services/apiClient';
import * as authService from '../services/authService';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';
import { useAuth } from './useAuth';

vi.mock('../services/authService');

const storage = new Map<string, string>();

const localStorageMock: Storage = {
  get length() {
    return storage.size;
  },
  clear: () => {
    storage.clear();
  },
  getItem: (key: string) => storage.get(key) ?? null,
  key: (index: number) => Array.from(storage.keys())[index] ?? null,
  removeItem: (key: string) => {
    storage.delete(key);
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
};

describe('useAuth', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('starts as authenticated when an access token is stored', () => {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'stored-token');

    const { result } = renderHook(() => useAuth());

    expect(result.current.accessToken).toBe('stored-token');
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('stores the token and marks the user as authenticated after login', async () => {
    const payload: LoginRequest = { email: 'user@example.com', password: 'password' };
    const response: AuthResponse = { access_token: 'new-token', token_type: 'bearer' };
    vi.mocked(authService.login).mockResolvedValue(response);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await expect(result.current.login(payload)).resolves.toEqual(response);
    });

    expect(authService.login).toHaveBeenCalledWith(payload);
    expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBe('new-token');
    expect(result.current.accessToken).toBe('new-token');
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('removes the token and marks the user as unauthenticated on logout', () => {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'stored-token');

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('registers a user and resets loading state', async () => {
    const payload: RegisterRequest = {
      email: 'user@example.com',
      nickname: 'user',
      password: 'password',
    };
    const response: User = {
      email: 'user@example.com',
      id: 1,
      is_active: true,
      nickname: 'user',
    };
    let resolveRegister: (value: User) => void = () => undefined;
    const registerResponse = new Promise<User>((resolve) => {
      resolveRegister = resolve;
    });
    vi.mocked(authService.register).mockReturnValue(registerResponse);

    const { result } = renderHook(() => useAuth());

    const registerPromise = result.current.register(payload);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await act(async () => {
      resolveRegister(response);
      await expect(registerPromise).resolves.toEqual(response);
    });

    expect(authService.register).toHaveBeenCalledWith(payload);
    expect(result.current.isLoading).toBe(false);
  });
});
