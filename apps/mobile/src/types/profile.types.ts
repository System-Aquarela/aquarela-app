export interface Profile {
  id: string;
  name: string;
  age: number;
  nickname: string;
  favoriteSubjects: string[];
  favoriteSongs: string[];
  sensitiveTopics: string[];
  photoUrl?: string;
}
