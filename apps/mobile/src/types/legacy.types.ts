export type LegacyAnswerType = 'texto' | 'audio' | 'video';

export interface LegacyEntry {
  id: string;
  profileId: string;
  question: string;
  answer: string;
  type: LegacyAnswerType;
  date: string;
}
