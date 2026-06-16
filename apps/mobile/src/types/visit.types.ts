import { Memory } from './memory.types';

export interface VisitRoadmap {
  initialPhrase: string;
  suggestedMemories: Memory[];
  suggestedSong: string;
  recommendedSubjects: string[];
  subjectsToAvoid: string[];
}

export interface VisitRecord {
  id: string;
  profileId: string;
  visitorId: string;
  date: string;
  generatedSmile: boolean;
  generatedConversation: boolean;
  generatedDiscomfort: boolean;
  observation?: string;
}
