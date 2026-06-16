import { storageService } from './storage.service';
import { DiaryEntry } from '../types/diary.types';
import { mockDiary } from '../mocks/diary.mock';

const DIARY_KEY = '@aquarela_diary';

export const diaryService = {
  async getEntries(): Promise<DiaryEntry[]> {
    const entries = await storageService.getItem<DiaryEntry[]>(DIARY_KEY);
    if (!entries) {
      await storageService.setItem(DIARY_KEY, mockDiary);
      return mockDiary;
    }
    return entries;
  },

  async addEntry(entry: DiaryEntry): Promise<void> {
    const entries = await this.getEntries();
    entries.unshift(entry);
    await storageService.setItem(DIARY_KEY, entries);
  }
};
