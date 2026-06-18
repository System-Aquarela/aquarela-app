import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user.types';
import { Profile } from '../types/profile.types';
import { authService } from '../services/auth.service';
import { profilesService } from '../services/profiles.service';

interface AppContextData {
  user: User | null;
  selectedProfile: Profile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  restoreSession: () => Promise<boolean>;
  logout: () => Promise<void>;
  selectProfile: (profile: Profile) => Promise<void>;
  refreshSelectedProfile: () => Promise<Profile | null>;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      const storedUser = await authService.getUser();
      if (storedUser) {
        setUser(storedUser);
        const storedProfile = await profilesService.getSelectedProfile();
        if (storedProfile) {
          const freshProfile = await profilesService.getProfile(storedProfile.id);
          await profilesService.setSelectedProfile(freshProfile);
          setSelectedProfile(freshProfile);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const loggedUser = await authService.login(email, password);
    setUser(loggedUser);
  }

  async function register(name: string, email: string, password: string) {
    const loggedUser = await authService.register(name, email, password);
    setUser(loggedUser);
  }

  async function restoreSession() {
    const storedUser = await authService.getUser();
    if (!storedUser) return false;
    setUser(storedUser);
    const storedProfile = await profilesService.getSelectedProfile();
    if (storedProfile) {
      const freshProfile = await profilesService.getProfile(storedProfile.id);
      await profilesService.setSelectedProfile(freshProfile);
      setSelectedProfile(freshProfile);
    }
    return true;
  }

  async function logout() {
    await authService.logout();
    await profilesService.clearSelectedProfile();
    setUser(null);
    setSelectedProfile(null);
  }

  async function selectProfile(profile: Profile) {
    await profilesService.setSelectedProfile(profile);
    setSelectedProfile(profile);
  }

  async function refreshSelectedProfile() {
    if (!selectedProfile) return null;
    const profile = await profilesService.getProfile(selectedProfile.id);
    await selectProfile(profile);
    return profile;
  }

  return (
    <AppContext.Provider value={{ user, selectedProfile, isLoading, login, register, restoreSession, logout, selectProfile, refreshSelectedProfile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
