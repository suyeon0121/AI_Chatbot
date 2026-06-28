import type { AxiosAdapter, AxiosResponse } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import apiClient, { ACCESS_TOKEN_STORAGE_KEY } from './apiClient';

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

describe('apiClient', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
    apiClient.defaults.adapter = captureConfigAdapter;
  });

  afterEach(() => {
    localStorage.clear();
    apiClient.defaults.adapter = undefined;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('uses the backend base URL by default', () => {
    expect(apiClient.defaults.baseURL).toBe('http://localhost:8000');
  });

  it('adds the stored access token to outgoing requests', async () => {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'jwt-token');

    const response = await apiClient.get('/api/chat/rooms');

    expect(response.config.headers.get('Authorization')).toBe('Bearer jwt-token');
  });

  it('does not add an authorization header when no token exists', async () => {
    const response = await apiClient.get('/api/chat/rooms');

    expect(response.config.headers.has('Authorization')).toBe(false);
  });
});

const captureConfigAdapter: AxiosAdapter = async (config) => {
  const response: AxiosResponse<null> = {
    config,
    data: null,
    headers: {},
    status: 200,
    statusText: 'OK',
  };

  return response;
};
