export type MemoryCategory = 'Família' | 'Viagens' | 'Músicas' | 'Infância' | 'Datas especiais' | 'Favoritas' | 'Sensíveis';

export interface Memory {
  id: string;
  profileId: string;
  title: string;
  period: string;
  story: string;
  category: MemoryCategory;
  peopleInvolved: string[];
  suggestedPhrase: string;
  previousReaction: string;
  isSensitive: boolean;
  isFavorite: boolean;
  imageUrl?: string;
}
