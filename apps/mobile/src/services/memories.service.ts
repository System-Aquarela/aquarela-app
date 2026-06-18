import { apiClient, resolveApiUrl } from './api.service';
import { profilesService } from './profiles.service';
import { Memory } from '../types/memory.types';

async function selectedProfileId() {
  const profile = await profilesService.getSelectedProfile();
  if (!profile) throw new Error('Selecione uma pessoa acompanhada.');
  return profile.id;
}

export const memoriesService = {
  async getMemories(): Promise<Memory[]> {
    const profileId = await selectedProfileId();
    const response = await apiClient.get<{ memories: Memory[] }>(`/profiles/${profileId}/memories`);
    return response.memories.map(memory => ({ ...memory, imageUrl: resolveApiUrl(memory.imageUrl) }));
  },

  async getMemory(id: string): Promise<Memory | null> {
    const response = await apiClient.get<{ memory: Memory }>(`/memories/${id}`);
    return { ...response.memory, imageUrl: resolveApiUrl(response.memory.imageUrl) };
  },

  async addMemory(memory: Memory): Promise<void> {
    const profileId = await selectedProfileId();
    await apiClient.post(`/profiles/${profileId}/memories`, {
      title: memory.title,
      period: memory.period,
      story: memory.story,
      category: memory.category,
      suggestedPhrase: memory.suggestedPhrase,
      previousReaction: memory.previousReaction,
      isSensitive: memory.isSensitive,
      isFavorite: memory.isFavorite,
      location: memory.location,
      mediaId: memory.mediaId,
      peopleIds: memory.peopleIds,
    });
  },

  async toggleFavorite(id: string): Promise<void> {
    const memory = await this.getMemory(id);
    await apiClient.patch(`/memories/${id}`, { isFavorite: !memory?.isFavorite });
  },
};
