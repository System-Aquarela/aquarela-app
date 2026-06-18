export type MemoryCategory =
  | 'Infância'
  | 'Adolescência'
  | 'Vida adulta'
  | 'Família'
  | 'Trabalho'
  | 'Viagens'
  | 'Conquistas'
  | 'Músicas'
  | 'Documentos'
  | 'Datas especiais'
  | 'Favoritas'
  | 'Sensíveis';

export type MemoryMediaType = 'foto' | 'video' | 'audio' | 'documento' | 'texto' | 'musica';

export interface Memory {
  id: string;
  profileId: string;
  title: string;
  period: string;
  story: string;
  category: MemoryCategory;
  peopleInvolved: string[];
  peopleIds?: string[];
  suggestedPhrase: string;
  previousReaction: string;
  isSensitive: boolean;
  isFavorite: boolean;
  mediaType?: MemoryMediaType;
  mediaId?: string;
  location?: string;
  createdAt?: string;
  imageUrl?: string;
}
