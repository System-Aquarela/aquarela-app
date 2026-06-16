import { storageService } from './storage.service';
import { User } from '../types/user.types';
import { mockUsers } from '../mocks/users.mock';

const AUTH_KEY = '@aquarela_auth_user';

export const authService = {
  async login(email: string): Promise<User> {
    // Simulando login
    const user = mockUsers.find(u => u.email === email) || {
      id: Math.random().toString(),
      name: email.split('@')[0],
      email: email
    };
    await storageService.setItem(AUTH_KEY, user);
    return user;
  },

  async getUser(): Promise<User | null> {
    return await storageService.getItem<User>(AUTH_KEY);
  },

  async logout(): Promise<void> {
    await storageService.removeItem(AUTH_KEY);
  }
};
