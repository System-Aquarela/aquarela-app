import Constants from 'expo-constants';
import { secureStorageService } from './secure-storage.service';

const ACCESS_TOKEN_KEY = '@aquarela_access_token';
const REFRESH_TOKEN_KEY = '@aquarela_refresh_token';

const extraApiUrl = Constants.expoConfig?.extra?.apiUrl;
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || extraApiUrl || 'http://localhost:3333').replace(/\/$/, '');

export function resolveApiUrl(url?: string) {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

interface AuthPayload {
  accessToken: string;
  refreshToken: string;
}

export const tokenService = {
  async setTokens(payload: AuthPayload) {
    await Promise.all([
      secureStorageService.setItem(ACCESS_TOKEN_KEY, payload.accessToken),
      secureStorageService.setItem(REFRESH_TOKEN_KEY, payload.refreshToken),
    ]);
  },

  async getAccessToken() {
    return secureStorageService.getItem(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken() {
    return secureStorageService.getItem(REFRESH_TOKEN_KEY);
  },

  async clear() {
    await Promise.all([
      secureStorageService.removeItem(ACCESS_TOKEN_KEY),
      secureStorageService.removeItem(REFRESH_TOKEN_KEY),
    ]);
  },
};

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || 'Não foi possível comunicar com o servidor.');
  }
  return data as T;
}

async function refreshAccessToken() {
  const refreshToken = await tokenService.getRefreshToken();
  if (!refreshToken) return false;
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) return false;
  const data = await response.json();
  await tokenService.setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return true;
}

export const apiClient = {
  async request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
    const accessToken = await tokenService.getAccessToken();
    const headers = new Headers(options.headers);
    if (options.body !== undefined && !(options.body instanceof FormData)) {
      headers.set('Content-Type', headers.get('Content-Type') || 'application/json');
    }
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    let response: Response;
    try {
      response = await fetch(`${API_URL}${path}`, { ...options, headers });
    } catch {
      throw new Error(`Servidor indisponível em ${API_URL}. Verifique o Docker e a URL da API.`);
    }
    if (response.status === 401 && retry && await refreshAccessToken()) {
      return this.request<T>(path, options, false);
    }
    return parseResponse<T>(response);
  },

  get<T>(path: string) {
    return this.request<T>(path);
  },

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(body || {}) });
  },

  patch<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: 'PATCH', body: JSON.stringify(body || {}) });
  },

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  },

  upload<T>(path: string, formData: FormData) {
    return this.request<T>(path, { method: 'POST', body: formData });
  },
};
