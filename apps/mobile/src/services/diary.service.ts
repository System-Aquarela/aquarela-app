import { apiClient } from './api.service';
import { profilesService } from './profiles.service';
import { DiaryEntry } from '../types/diary.types';

async function selectedProfileId() {
  const profile = await profilesService.getSelectedProfile();
  if (!profile) throw new Error('Selecione uma pessoa acompanhada.');
  return profile.id;
}

export const diaryService = {
  async getEntries(): Promise<DiaryEntry[]> {
    const profileId = await selectedProfileId();
    const response = await apiClient.get<{ entries: DiaryEntry[] }>(`/profiles/${profileId}/diary`);
    return response.entries;
  },

  async addEntry(entry: DiaryEntry): Promise<void> {
    const profileId = await selectedProfileId();
    await apiClient.post(`/profiles/${profileId}/diary`, entry);
  },
};
