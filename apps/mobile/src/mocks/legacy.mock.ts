import { LegacyEntry } from '../types/legacy.types';

export const mockLegacyEntries: LegacyEntry[] = [
  {
    id: 'leg1',
    profileId: 'p1',
    question: 'Qual conselho você gostaria de deixar para a família?',
    answer: 'Cuidem uns dos outros e nunca deixem o almoço de domingo acabar.',
    type: 'texto',
    date: new Date().toISOString(),
  },
  {
    id: 'leg2',
    profileId: 'p1',
    question: 'Qual conquista te deixa mais feliz?',
    answer: 'Ter criado meus filhos perto da família e da música.',
    type: 'audio',
    date: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
];
