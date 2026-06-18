import { apiClient, tokenService } from './api.service';
import { secureStorageService } from './secure-storage.service';
import { User } from '../types/user.types';

const USER_KEY = '@aquarela_auth_user';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    await tokenService.setTokens(response);
    await secureStorageService.setItem(USER_KEY, JSON.stringify(response.user));
    return response.user;
  },

  async register(name: string, email: string, password: string): Promise<User> {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
      termsAccepted: true,
    });
    await tokenService.setTokens(response);
    await secureStorageService.setItem(USER_KEY, JSON.stringify(response.user));
    return response.user;
  },

  async getUser(): Promise<User | null> {
    const storedUser = await secureStorageService.getItem(USER_KEY);
    if (!storedUser) return null;
    const response = await apiClient.get<{ user: User }>('/auth/me');
    await secureStorageService.setItem(USER_KEY, JSON.stringify(response.user));
    return response.user;
  },

  async logout(): Promise<void> {
    const refreshToken = await tokenService.getRefreshToken();
    if (refreshToken) {
      await apiClient.post('/auth/logout', { refreshToken }).catch(() => undefined);
    }
    await tokenService.clear();
    await secureStorageService.removeItem(USER_KEY);
  },
};
