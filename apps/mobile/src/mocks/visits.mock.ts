import { VisitRecord } from '../types/visit.types';

export const mockVisits: VisitRecord[] = [
  {
    id: 'v1',
    profileId: 'p1',
    visitorId: 'u1',
    date: '2023-10-01T14:00:00Z',
    generatedSmile: true,
    generatedConversation: true,
    generatedDiscomfort: false,
    observation: 'Gostou muito de ver as fotos antigas.',
  }
];
