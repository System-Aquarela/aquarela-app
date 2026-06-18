import { storageService } from './storage.service';
import { apiClient, resolveApiUrl } from './api.service';
import { Profile } from '../types/profile.types';

const SELECTED_PROFILE_KEY = '@aquarela_selected_profile';

export const profilesService = {
  async getProfiles(): Promise<Profile[]> {
    const response = await apiClient.get<{ profiles: Profile[] }>('/profiles');
    return response.profiles.map(profile => ({ ...profile, photoUrl: resolveApiUrl(profile.photoUrl) }));
  },

  async createProfile(profile: Pick<Profile, 'name' | 'nickname' | 'age'> & Pick<Profile, 'city'>): Promise<Profile> {
    const response = await apiClient.post<{ profile: Profile }>('/profiles', profile);
    return { ...response.profile, photoUrl: resolveApiUrl(response.profile.photoUrl) };
  },

  async getProfile(id: string): Promise<Profile> {
    const response = await apiClient.get<{ profile: Profile }>(`/profiles/${id}`);
    return { ...response.profile, photoUrl: resolveApiUrl(response.profile.photoUrl) };
  },

  async updateProfile(id: string, changes: Partial<Profile>): Promise<Profile> {
    const response = await apiClient.patch<{ profile: Profile }>(`/profiles/${id}`, changes);
    return { ...response.profile, photoUrl: resolveApiUrl(response.profile.photoUrl) };
  },

  async getSelectedProfile(): Promise<Profile | null> {
    return await storageService.getItem<Profile>(SELECTED_PROFILE_KEY);
  },

  async setSelectedProfile(profile: Profile): Promise<void> {
    await storageService.setItem(SELECTED_PROFILE_KEY, profile);
  },

  async clearSelectedProfile(): Promise<void> {
    await storageService.removeItem(SELECTED_PROFILE_KEY);
  },
};
