import { apiClient, resolveApiUrl } from './api.service';
import { profilesService } from './profiles.service';
import { Person } from '../types/person.types';

async function selectedProfileId() {
  const profile = await profilesService.getSelectedProfile();
  if (!profile) throw new Error('Selecione uma pessoa acompanhada.');
  return profile.id;
}

export const peopleService = {
  async getPeople(): Promise<Person[]> {
    const profileId = await selectedProfileId();
    const response = await apiClient.get<{ people: Person[] }>(`/profiles/${profileId}/people`);
    return response.people.map(person => ({ ...person, photoUrl: resolveApiUrl(person.photoUrl) }));
  },

  async getPerson(id: string): Promise<Person> {
    const response = await apiClient.get<{ person: Person }>(`/people/${id}`);
    return { ...response.person, photoUrl: resolveApiUrl(response.person.photoUrl) };
  },

  async addPerson(person: Person): Promise<Person> {
    const profileId = await selectedProfileId();
    const response = await apiClient.post<{ person: Person }>(`/profiles/${profileId}/people`, person);
    return { ...response.person, photoUrl: resolveApiUrl(response.person.photoUrl) };
  },

  async updatePerson(id: string, changes: Partial<Person>): Promise<Person> {
    const response = await apiClient.patch<{ person: Person }>(`/people/${id}`, changes);
    return { ...response.person, photoUrl: resolveApiUrl(response.person.photoUrl) };
  },
};
