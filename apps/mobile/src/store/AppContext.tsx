import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user.types';
import { Profile } from '../types/profile.types';
import { authService } from '../services/auth.service';
import { profilesService } from '../services/profiles.service';

interface AppContextData {
  user: User | null;
  selectedProfile: Profile | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  selectProfile: (profile: Profile) => Promise<void>;
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
        setSelectedProfile(storedProfile);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string) {
    const loggedUser = await authService.login(email);
    setUser(loggedUser);
  }

  async function logout() {
    await authService.logout();
    setUser(null);
    setSelectedProfile(null);
  }

  async function selectProfile(profile: Profile) {
    await profilesService.setSelectedProfile(profile);
    setSelectedProfile(profile);
  }

  return (
    <AppContext.Provider value={{ user, selectedProfile, isLoading, login, logout, selectProfile }}>
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
