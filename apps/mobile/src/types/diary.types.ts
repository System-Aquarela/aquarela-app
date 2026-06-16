export type MoodType = 'Tranquila' | 'Alegre' | 'Cansada' | 'Confusa' | 'Agitada' | 'Triste';

export interface DiaryEntry {
  id: string;
  profileId: string;
  registeredBy: string; // user id or name
  date: string;
  mood: MoodType;
  interaction: string;
  orientation: string;
  recognition: string;
  observation?: string;
}
