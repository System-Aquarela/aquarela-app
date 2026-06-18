import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';
import { diaryService } from '../../src/services/diary.service';
import { DiaryEntry } from '../../src/types/diary.types';

export default function DiaryScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    diaryService.getEntries().then(setEntries);
  }, []);

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="xl" weight="bold" color={theme.colors.blueMemory}>
            Cuidador
          </Text>
          <Text variant="sm" color={theme.colors.gray500}>
            Diário inteligente, sinais observados e relatórios.
          </Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/diary/create')}>
          <Ionicons name="add" size={24} color={theme.colors.whiteSnow} />
        </TouchableOpacity>
      </View>

      <View style={styles.quickRow}>
        <QuickAction title="Modo visita" icon="calendar-outline" onPress={() => router.push('/tabs/visit')} />
        <QuickAction title="Sinais" icon="warning-outline" onPress={() => router.push('/attention-signals/index')} />
        <QuickAction title="Relatórios" icon="bar-chart-outline" onPress={() => router.push('/reports')} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.entriesList}>
        {entries.map((entry, index) => (
          <View key={entry.id} style={styles.entryRow}>
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineIcon, { backgroundColor: getMoodColor(entry.mood) }]}>
                <Ionicons name={getMoodIcon(entry.mood)} size={20} color={theme.colors.whiteSnow} />
              </View>
              {index !== entries.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <Card style={styles.entryCard} padding="lg">
              <View style={styles.entryHeader}>
                <Text variant="sm" weight="bold" color={theme.colors.gray500} style={styles.entryInfo}>
                  {formatDate(entry.date)} • {entry.registeredBy}
                </Text>
                <View style={styles.moodTag}>
                  <Text variant="sm" weight="bold" color={theme.colors.readingGraphite}>{entry.mood}</Text>
                </View>
              </View>
              <Text variant="md" color={theme.colors.readingGraphite} style={styles.entryText}>
                {entry.observation || entry.interaction}
              </Text>
              <View style={styles.detailsGrid}>
                <Detail label="Sono" value={entry.sleep || 'Não informado'} />
                <Detail label="Alimentação" value={entry.food || 'Não informado'} />
                <Detail label="Energia" value={entry.energy || 'Não informado'} />
                <Detail label="Reconhecimento" value={entry.recognition} />
              </View>
            </Card>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

function QuickAction({ title, icon, onPress }: { title: string; icon: any; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <Ionicons name={icon} size={22} color={theme.colors.blueMemory} />
      <Text variant="xs" weight="bold" color={theme.colors.readingGraphite} align="center" style={styles.quickText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text variant="xs" weight="bold" color={theme.colors.gray500}>{label}</Text>
      <Text variant="sm" color={theme.colors.readingGraphite}>{value}</Text>
    </View>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function getMoodColor(mood: string) {
  if (mood === 'Agitada' || mood === 'Confusa') return theme.colors.attention;
  if (mood === 'Triste') return theme.colors.softTerracotta;
  return theme.colors.sereneGreen;
}

function getMoodIcon(mood: string): any {
  if (mood === 'Cansada') return 'moon-outline';
  if (mood === 'Agitada' || mood === 'Confusa') return 'alert-outline';
  if (mood === 'Triste') return 'rainy-outline';
  return 'sunny-outline';
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.blueMemory,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  quickAction: {
    flex: 1,
    minHeight: 74,
    backgroundColor: theme.colors.whiteSnow,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
  },
  quickText: {
    marginTop: theme.spacing.xs,
  },
  entriesList: {
    paddingBottom: 110,
  },
  entryRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  timelineLeft: {
    width: 40,
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  timelineIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.gray200,
    marginTop: 4,
  },
  entryCard: {
    flex: 1,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  entryInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  moodTag: {
    backgroundColor: '#E6F0EB',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
    borderRadius: theme.radius.round,
  },
  entryText: {
    lineHeight: 23,
    marginBottom: theme.spacing.md,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  detailItem: {
    width: '47%',
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
  },
});
