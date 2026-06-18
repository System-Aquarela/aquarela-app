import { apiClient } from './api.service';
import { Person } from '../types/person.types';
import { profilesService } from './profiles.service';

export interface ScannerMatch {
  personId: string;
  score: number;
  person?: Person;
}

export const scannerService = {
  async recognize(uri: string): Promise<ScannerMatch[]> {
    const profile = await profilesService.getSelectedProfile();
    if (!profile) throw new Error('Selecione uma pessoa acompanhada.');
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: `scanner-${Date.now()}.jpg`,
      type: 'image/jpeg',
    } as any);
    const response = await apiClient.upload<{ matches: ScannerMatch[] }>(`/scanner/recognize?profileId=${encodeURIComponent(profile.id)}`, formData);
    return response.matches;
  },

  async uploadFaceImage(personId: string, uri: string) {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: `face-${Date.now()}.jpg`,
      type: 'image/jpeg',
    } as any);
    return apiClient.upload(`/people/${personId}/face-images`, formData);
  },
};
