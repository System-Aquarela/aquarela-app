import { Person } from '../types/person.types';

export const mockPeople: Person[] = [
  {
    id: 'peo1',
    profileId: 'p1',
    name: 'Ana',
    relation: 'Filha',
    description: 'Filha mais velha de Dona Lúcia.',
    supportPhrase: 'Mãe, a Ana te ama muito.',
  },
  {
    id: 'peo2',
    profileId: 'p1',
    name: 'João',
    relation: 'Filho',
    description: 'Filho de Dona Lúcia.',
  },
  {
    id: 'peo3',
    profileId: 'p1',
    name: 'Pedro',
    relation: 'Neto',
    description: 'Neto que costuma visitá-la aos domingos.',
  }
];
