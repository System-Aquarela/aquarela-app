import { apiClient } from './api.service';

export type MemberRole = 'owner' | 'caregiver' | 'family' | 'viewer';

export interface FamilyMember {
  id: string;
  role: MemberRole;
  user: { id: string; name: string; email: string };
}

export const membersService = {
  async list(profileId: string) {
    const response = await apiClient.get<{ members: FamilyMember[] }>(`/profiles/${profileId}/members`);
    return response.members;
  },

  async invite(profileId: string, email: string, role: MemberRole) {
    return apiClient.post<{ member: FamilyMember }>(`/profiles/${profileId}/members`, { email, role });
  },

  async update(profileId: string, membershipId: string, role: MemberRole) {
    return apiClient.patch<{ member: FamilyMember }>(`/profiles/${profileId}/members/${membershipId}`, { role });
  },

  async remove(profileId: string, membershipId: string) {
    return apiClient.delete(`/profiles/${profileId}/members/${membershipId}`);
  },
};
