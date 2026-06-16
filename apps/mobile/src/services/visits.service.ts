import { storageService } from './storage.service';
import { VisitRecord } from '../types/visit.types';
import { mockVisits } from '../mocks/visits.mock';

const VISITS_KEY = '@aquarela_visits';

export const visitsService = {
  async getVisits(): Promise<VisitRecord[]> {
    const visits = await storageService.getItem<VisitRecord[]>(VISITS_KEY);
    if (!visits) {
      await storageService.setItem(VISITS_KEY, mockVisits);
      return mockVisits;
    }
    return visits;
  },

  async addVisit(visit: VisitRecord): Promise<void> {
    const visits = await this.getVisits();
    visits.unshift(visit);
    await storageService.setItem(VISITS_KEY, visits);
  }
};
