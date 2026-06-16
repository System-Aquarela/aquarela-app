import { storageService } from './storage.service';
import { Profile } from '../types/profile.types';
import { mockProfiles } from '../mocks/profiles.mock';

const PROFILES_KEY = '@aquarela_profiles';
const SELECTED_PROFILE_KEY = '@aquarela_selected_profile';

export const profilesService = {
  async getProfiles(): Promise<Profile[]> {
    const profiles = await storageService.getItem<Profile[]>(PROFILES_KEY);
    if (!profiles) {
      await storageService.setItem(PROFILES_KEY, mockProfiles);
      return mockProfiles;
    }
    return profiles;
  },

  async getSelectedProfile(): Promise<Profile | null> {
    return await storageService.getItem<Profile>(SELECTED_PROFILE_KEY);
  },

  async setSelectedProfile(profile: Profile): Promise<void> {
    await storageService.setItem(SELECTED_PROFILE_KEY, profile);
  }
};
