import { apiClient, resolveApiUrl } from './api.service';
import { profilesService } from './profiles.service';
import { DiaryEntry } from '../types/diary.types';
import { Memory } from '../types/memory.types';
import { VisitRecord } from '../types/visit.types';

export interface ConnectionSummary {
  score: number;
  label: string;
  detail: string;
}

export interface ReportSummary {
  mood: string;
  interactions: number;
  memoriesAccessed: number;
  recognition: string;
  trend: string;
}

export interface ReportExport {
  asset: {
    id: string;
    url: string;
    mimeType: string;
    size: number;
  };
  url: string;
}

async function selectedProfileId() {
  const profile = await profilesService.getSelectedProfile();
  if (!profile) throw new Error('Selecione uma pessoa acompanhada.');
  return profile.id;
}

export const insightsService = {
  async getRemoteInsights(): Promise<{ connection: ConnectionSummary; insights: string[] }> {
    const profileId = await selectedProfileId();
    return apiClient.get(`/profiles/${profileId}/insights`);
  },

  async getRemoteReport(): Promise<{ connection: ConnectionSummary; report: ReportSummary }> {
    const profileId = await selectedProfileId();
    return apiClient.get(`/profiles/${profileId}/reports`);
  },

  async exportReport(): Promise<ReportExport> {
    const profileId = await selectedProfileId();
    const report = await apiClient.post<ReportExport>(`/profiles/${profileId}/reports/export`);
    return { ...report, url: resolveApiUrl(report.url) || report.url, asset: { ...report.asset, url: resolveApiUrl(report.asset.url) || report.asset.url } };
  },

  getConnectionSummary(memories: Memory[], diary: DiaryEntry[], visits: VisitRecord[]): ConnectionSummary {
    const positiveVisits = visits.filter(visit => visit.generatedSmile || visit.generatedConversation).length;
    const diaryBoost = Math.min(diary.length * 6, 24);
    const memoryBoost = Math.min(memories.filter(memory => memory.isFavorite).length * 8, 24);
    const visitBoost = Math.min(positiveVisits * 10, 30);
    const score = Math.min(100, 38 + diaryBoost + memoryBoost + visitBoost);
    return {
      score,
      label: score >= 80 ? 'conexão familiar forte' : score >= 60 ? 'conexão em crescimento' : 'presença em construção',
      detail: 'Indicador de presença e interação, sem julgamento familiar.',
    };
  },

  getInsights(memories: Memory[], diary: DiaryEntry[], visits: VisitRecord[]): string[] {
    const latestMood = diary[0]?.mood || 'Tranquila';
    const favoriteMemory = memories.find(memory => memory.isFavorite)?.title || 'uma memória favorita';
    const hadConversation = visits.some(visit => visit.generatedConversation);
    return [
      `${favoriteMemory} aparece como boa ponte para iniciar conversas afetuosas.`,
      `Registros recentes indicam humor predominante: ${latestMood.toLowerCase()}.`,
      hadConversation
        ? 'As últimas visitas tiveram conversa registrada. Vale repetir músicas e fotos usadas nesses momentos.'
        : 'Teste começar a próxima visita com perguntas simples sobre rotina e família.',
    ];
  },

  getReport(memories: Memory[], diary: DiaryEntry[], visits: VisitRecord[]): ReportSummary {
    return {
      mood: diary[0]?.mood || 'Sem registro recente',
      interactions: visits.filter(visit => visit.generatedConversation).length,
      memoriesAccessed: memories.length,
      recognition: diary[0]?.recognition || 'Sem registro recente',
      trend: 'Tendências calculadas com base nos registros disponíveis.',
    };
  },
};
