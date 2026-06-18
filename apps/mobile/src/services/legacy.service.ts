import { apiClient } from './api.service';
import { profilesService } from './profiles.service';
import { LegacyEntry } from '../types/legacy.types';

async function selectedProfileId() {
  const profile = await profilesService.getSelectedProfile();
  if (!profile) throw new Error('Selecione uma pessoa acompanhada.');
  return profile.id;
}

export const legacyService = {
  async getEntries(): Promise<LegacyEntry[]> {
    const profileId = await selectedProfileId();
    const response = await apiClient.get<{ entries: LegacyEntry[] }>(`/profiles/${profileId}/legacy`);
    return response.entries;
  },

  async addEntry(entry: LegacyEntry): Promise<void> {
    const profileId = await selectedProfileId();
    await apiClient.post(`/profiles/${profileId}/legacy`, entry);
  },
};
