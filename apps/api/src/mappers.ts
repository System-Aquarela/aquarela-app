import { MemoryCategory, MediaType } from '@prisma/client';
import { privateMediaUrl } from './media.js';

export function toMemoryCategory(value: string): MemoryCategory {
  const normalized = value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, '_');
  const map: Record<string, MemoryCategory> = {
    infancia: 'infancia',
    adolescencia: 'adolescencia',
    vida_adulta: 'vida_adulta',
    familia: 'familia',
    trabalho: 'trabalho',
    viagens: 'viagens',
    conquistas: 'conquistas',
    musicas: 'musicas',
    documentos: 'documentos',
    datas_especiais: 'datas_especiais',
    favoritas: 'favoritas',
    sensiveis: 'sensiveis',
  };
  return map[normalized] || 'familia';
}

export function fromMemoryCategory(value: MemoryCategory) {
  const map: Record<MemoryCategory, string> = {
    infancia: 'Infância',
    adolescencia: 'Adolescência',
    vida_adulta: 'Vida adulta',
    familia: 'Família',
    trabalho: 'Trabalho',
    viagens: 'Viagens',
    conquistas: 'Conquistas',
    musicas: 'Músicas',
    documentos: 'Documentos',
    datas_especiais: 'Datas especiais',
    favoritas: 'Favoritas',
    sensiveis: 'Sensíveis',
  };
  return map[value];
}

export function toMediaType(value: string): MediaType {
  if (value.startsWith('image/')) return 'photo';
  if (value.startsWith('video/')) return 'video';
  if (value.startsWith('audio/')) return 'audio';
  if (value.includes('pdf') || value.includes('document') || value.includes('text')) return 'document';
  return 'document';
}

function fromMediaType(value?: MediaType) {
  const map: Partial<Record<MediaType, string>> = {
    photo: 'foto',
    video: 'video',
    audio: 'audio',
    document: 'documento',
    text: 'texto',
    music: 'musica',
  };
  return value ? map[value] : undefined;
}

export function mapProfile(profile: any, userId: string) {
  return {
    id: profile.id,
    name: profile.name,
    age: profile.age ?? 0,
    nickname: profile.nickname || profile.name,
    favoriteSubjects: profile.favoriteSubjects || [],
    favoriteSongs: profile.favoriteSongs || [],
    sensitiveTopics: profile.sensitiveTopics || [],
    city: profile.city || undefined,
    role: profile.role || undefined,
    updatedAt: profile.updatedAt?.toISOString?.(),
    photoUrl: profile.photoMedia?.id ? privateMediaUrl(profile.photoMedia.id, userId) : profile.photoUrl || undefined,
  };
}

export function mapPerson(person: any, userId: string) {
  return {
    id: person.id,
    profileId: person.profileId,
    name: person.name,
    relation: person.relation,
    description: person.description,
    supportPhrase: person.supportPhrase || undefined,
    photoUrl: person.photoMedia?.id ? privateMediaUrl(person.photoMedia.id, userId) : person.photoUrl || undefined,
    birthDate: person.birthDate?.toISOString?.() || undefined,
    stories: person.stories || [],
    sharedMoments: person.sharedMoments || [],
    lastInteraction: person.lastInteraction || undefined,
    scannerConsent: person.scannerConsent,
  };
}

export function mapMemory(memory: any, userId: string) {
  return {
    id: memory.id,
    profileId: memory.profileId,
    title: memory.title,
    period: memory.period,
    story: memory.story,
    category: fromMemoryCategory(memory.category),
    peopleInvolved: memory.people?.map((item: any) => item.person?.name).filter(Boolean) || [],
    suggestedPhrase: memory.suggestedPhrase,
    previousReaction: memory.previousReaction || 'Ainda sem reação registrada.',
    isSensitive: memory.isSensitive,
    isFavorite: memory.isFavorite,
    mediaType: fromMediaType(memory.media?.type),
    location: memory.location || undefined,
    createdAt: memory.createdAt?.toISOString?.(),
    imageUrl: memory.media?.id ? privateMediaUrl(memory.media.id, userId) : undefined,
  };
}
