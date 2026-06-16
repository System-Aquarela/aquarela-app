import { storageService } from './storage.service';
import { Memory } from '../types/memory.types';
import { mockMemories } from '../mocks/memories.mock';

const MEMORIES_KEY = '@aquarela_memories';

export const memoriesService = {
  async getMemories(): Promise<Memory[]> {
    const memories = await storageService.getItem<Memory[]>(MEMORIES_KEY);
    if (!memories) {
      // Initialize with mock
      await storageService.setItem(MEMORIES_KEY, mockMemories);
      return mockMemories;
    }
    return memories;
  },

  async addMemory(memory: Memory): Promise<void> {
    const memories = await this.getMemories();
    memories.unshift(memory);
    await storageService.setItem(MEMORIES_KEY, memories);
  },

  async toggleFavorite(id: string): Promise<void> {
    const memories = await this.getMemories();
    const updated = memories.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m);
    await storageService.setItem(MEMORIES_KEY, updated);
  }
};
