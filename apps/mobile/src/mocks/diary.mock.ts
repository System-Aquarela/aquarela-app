import { DiaryEntry } from '../types/diary.types';

export const mockDiary: DiaryEntry[] = [
  {
    id: 'd1',
    profileId: 'p1',
    registeredBy: 'Ana',
    date: new Date().toISOString(),
    mood: 'Tranquila',
    interaction: 'Boa',
    orientation: 'Orientada na maior parte do tempo',
    recognition: 'Reconheceu todos',
    observation: 'Tarde super agradável',
  }
];
