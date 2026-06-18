export interface Profile {
  id: string;
  name: string;
  age: number;
  nickname: string;
  favoriteSubjects: string[];
  favoriteSongs: string[];
  sensitiveTopics: string[];
  photoUrl?: string;
  photoMediaId?: string;
  city?: string;
  role?: 'owner' | 'caregiver' | 'family' | 'viewer';
  updatedAt?: string;
}
