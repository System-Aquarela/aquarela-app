import { apiClient, resolveApiUrl } from './api.service';
import { profilesService } from './profiles.service';

export interface UploadedAsset {
  id: string;
  url: string;
  type: string;
  mimeType: string;
}

export const mediaService = {
  async upload(uri: string, name: string, mimeType = 'application/octet-stream'): Promise<UploadedAsset> {
    const profile = await profilesService.getSelectedProfile();
    if (!profile) throw new Error('Selecione uma pessoa acompanhada.');
    const formData = new FormData();
    formData.append('file', {
      uri,
      name,
      type: mimeType,
    } as any);

    const response = await apiClient.upload<{ asset: UploadedAsset }>(`/media/upload?profileId=${encodeURIComponent(profile.id)}`, formData);
    return { ...response.asset, url: resolveApiUrl(response.asset.url) || response.asset.url };
  },
};
