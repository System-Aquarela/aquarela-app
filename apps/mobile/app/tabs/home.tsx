import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { useApp } from '../../src/store/AppContext';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';
import { memoriesService } from '../../src/services/memories.service';
import { diaryService } from '../../src/services/diary.service';
import { visitsService } from '../../src/services/visits.service';
import { insightsService, ConnectionSummary } from '../../src/services/insights.service';
import { Memory } from '../../src/types/memory.types';
import { DiaryEntry } from '../../src/types/diary.types';

export default function HomeScreen() {
  const router = useRouter();
  const { user, selectedProfile } = useApp();
  const [latestMemory, setLatestMemory] = useState<Memory | null>(null);
  const [latestDiary, setLatestDiary] = useState<DiaryEntry | null>(null);
  const [connection, setConnection] = useState<ConnectionSummary | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const [memories, diary, visits] = await Promise.all([
      memoriesService.getMemories(),
      diaryService.getEntries(),
      visitsService.getVisits(),
    ]);
    setLatestMemory(memories[0] || null);
    setLatestDiary(diary[0] || null);
    setConnection(insightsService.getConnectionSummary(memories, diary, visits));
  }

  return (
    <Screen scrollable contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="sm" weight="bold" color={theme.colors.gray500}>
            Aquarela
          </Text>
          <Text variant="xl" weight="bold" color={theme.colors.blueMemory}>
            Oi, {user?.name?.split(' ')[0] || 'família'}
          </Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/settings/index')}>
          <Ionicons name="settings-outline" size={22} color={theme.colors.blueMemory} />
        </TouchableOpacity>
      </View>

      <Card style={styles.profileCard} padding="lg">
        <View style={styles.profileTop}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color={theme.colors.whiteSnow} />
          </View>
          <View style={styles.profileInfo}>
            <Text variant="lg" weight="bold" color={theme.colors.readingGraphite}>
              {selectedProfile?.name || 'Pessoa acompanhada'}
            </Text>
            <Text variant="sm" color={theme.colors.gray500}>
              {selectedProfile?.age || '--'} anos • {selectedProfile?.nickname || 'perfil de cuidado'}
            </Text>
          </View>
        </View>
        <Text variant="md" color={theme.colors.gray500} style={styles.profileText}>
          Hoje pode ser um bom dia para retomar uma memória leve e registrar como foi a interação.
        </Text>
      </Card>

      <View style={styles.metricsRow}>
        <Card style={styles.connectionCard} padding="md">
          <View style={styles.scoreCircle}>
            <Text variant="xl" weight="bold" color={theme.colors.blueMemory}>
              {connection?.score || 0}
            </Text>
          </View>
          <Text variant="sm" weight="bold" color={theme.colors.readingGraphite} align="center">
            Índice de conexão
          </Text>
          <Text variant="xs" color={theme.colors.gray500} align="center" style={styles.metricHelp}>
            {connection?.label || 'presença em construção'}
          </Text>
        </Card>

        <Card style={styles.connectionCard} padding="md">
          <View style={[styles.scoreCircle, styles.moodCircle]}>
            <Ionicons name="sunny-outline" size={24} color={theme.colors.sereneGreen} />
          </View>
          <Text variant="sm" weight="bold" color={theme.colors.readingGraphite} align="center">
            Humor recente
          </Text>
          <Text variant="xs" color={theme.colors.gray500} align="center" style={styles.metricHelp}>
            {latestDiary?.mood || 'Sem registro'}
          </Text>
        </Card>
      </View>

      <Card style={styles.memoryCard} padding="lg">
        <Text variant="sm" weight="bold" color={theme.colors.softTerracotta}>
          MEMÓRIA RECOMENDADA
        </Text>
        <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.cardTitle}>
          {latestMemory?.title || 'Cadastre a primeira memória'}
        </Text>
        <Text variant="md" color={theme.colors.gray500} style={styles.cardBody}>
          {latestMemory?.suggestedPhrase || 'Use fotos, histórias ou músicas para criar uma ponte afetiva.'}
        </Text>
        <TouchableOpacity style={styles.inlineAction} onPress={() => router.push('/visits/roadmap')}>
          <Ionicons name="heart-outline" size={18} color={theme.colors.blueMemory} />
          <Text variant="sm" weight="bold" color={theme.colors.blueMemory} style={styles.inlineText}>
            Preparar visita
          </Text>
        </TouchableOpacity>
      </Card>

      <View style={styles.shortcutsGrid}>
        <Shortcut icon="add-circle-outline" title="Nova memória" onPress={() => router.push('/memories/create')} />
        <Shortcut icon="scan-outline" title="Scanner" onPress={() => router.push('/tabs/scanner')} />
        <Shortcut icon="map-outline" title="Mapa afetivo" onPress={() => router.push('/memories/affective-map')} />
        <Shortcut icon="sparkles-outline" title="Insights" onPress={() => router.push('/reports')} />
        <Shortcut icon="book-outline" title="Legados" onPress={() => router.push('/legacy')} />
        <Shortcut icon="chatbubble-ellipses-outline" title="Chatbot" onPress={() => router.push('/chatbot')} />
      </View>

      <Card style={styles.diaryCard} padding="lg">
        <View style={styles.sectionHeader}>
          <Text variant="lg" weight="bold" color={theme.colors.blueMemory}>
            Última atualização
          </Text>
          <TouchableOpacity onPress={() => router.push('/tabs/diary')}>
            <Text variant="sm" weight="bold" color={theme.colors.softTerracotta}>
              Ver diário
            </Text>
          </TouchableOpacity>
        </View>
        <Text variant="md" color={theme.colors.readingGraphite} style={styles.cardBody}>
          {latestDiary?.observation || latestDiary?.interaction || 'Nenhum registro local ainda.'}
        </Text>
      </Card>
    </Screen>
  );
}

function Shortcut({ icon, title, onPress }: { icon: any; title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.shortcut} onPress={onPress} activeOpacity={0.85}>
      <Ionicons name={icon} size={24} color={theme.colors.blueMemory} />
      <Text variant="sm" weight="bold" color={theme.colors.readingGraphite} align="center" style={styles.shortcutText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.whiteSnow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    marginBottom: theme.spacing.lg,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: theme.colors.sereneGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileText: {
    lineHeight: 22,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  connectionCard: {
    flex: 1,
    alignItems: 'center',
  },
  scoreCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 4,
    borderColor: theme.colors.sereneGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  moodCircle: {
    borderColor: theme.colors.lightSand,
  },
  metricHelp: {
    marginTop: theme.spacing.xs,
    lineHeight: 16,
  },
  memoryCard: {
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.softTerracotta,
  },
  cardTitle: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  cardBody: {
    lineHeight: 23,
  },
  inlineAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  inlineText: {
    marginLeft: theme.spacing.xs,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  shortcut: {
    width: '30.5%',
    minHeight: 94,
    backgroundColor: theme.colors.whiteSnow,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
  },
  shortcutText: {
    marginTop: theme.spacing.sm,
  },
  diaryCard: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
});
