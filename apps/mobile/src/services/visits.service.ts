import { apiClient } from './api.service';
import { profilesService } from './profiles.service';
import { VisitRecord } from '../types/visit.types';

async function selectedProfileId() {
  const profile = await profilesService.getSelectedProfile();
  if (!profile) throw new Error('Selecione uma pessoa acompanhada.');
  return profile.id;
}

export const visitsService = {
  async getVisits(): Promise<VisitRecord[]> {
    const profileId = await selectedProfileId();
    const response = await apiClient.get<{ visits: VisitRecord[] }>(`/profiles/${profileId}/visits`);
    return response.visits;
  },

  async addVisit(visit: VisitRecord): Promise<void> {
    const profileId = await selectedProfileId();
    await apiClient.post(`/profiles/${profileId}/visits`, visit);
  },
};
