export interface Person {
  id: string;
  profileId: string;
  name: string;
  relation: string;
  description: string;
  supportPhrase?: string;
  photoUrl?: string;
  photoMediaId?: string;
  birthDate?: string;
  stories?: string[];
  sharedMoments?: string[];
  lastInteraction?: string;
  scannerConsent?: boolean;
}
