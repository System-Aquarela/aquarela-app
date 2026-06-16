import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function DiaryScreen() {
  const router = useRouter();

  const mockEntries = [
    {
      id: '1',
      date: 'Hoje, 09:30',
      author: 'Cuidador',
      mood: 'Tranquila',
      text: 'Dona Helena acordou bem, tomou o café da manhã completo. Conversamos sobre as flores do jardim e ela estava bastante lúcida e calma.',
      icon: 'sunny',
      iconBg: '#FCAE9B' // light peach
    },
    {
      id: '2',
      date: 'Ontem, 15:45',
      author: 'Ana (filha)',
      mood: 'Alegre',
      text: 'Tivemos uma ótima visita! Mostrei o álbum de fotos da viagem para a praia e ela lembrou de várias histórias do papai. Rimos bastante.',
      icon: 'people',
      iconBg: '#355C7D',
      iconColor: '#FFF',
      resources: ['image', 'musical-notes']
    },
    {
      id: '3',
      date: 'Ontem, 19:20',
      author: 'Cuidador',
      mood: 'Confusa',
      text: 'Um pouco agitada no final do dia, perguntando sobre horários. Colocamos uma música suave e a ajudou a relaxar para dormir.',
      icon: 'moon',
      iconBg: '#FDE4DE'
    }
  ];

  return (
    <Screen style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={24} color={theme.colors.gray400} />
        </View>
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory}>
          Aquarela
        </Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={28} color={theme.colors.blueMemory} />
        </TouchableOpacity>
      </View>

      {/* Title & Add Button */}
      <View style={styles.titleRow}>
        <Text variant="xxl" weight="bold" color={theme.colors.blueMemory}>
          Diário
        </Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/diary/create')}>
          <Ionicons name="add" size={24} color={theme.colors.whiteSnow} />
        </TouchableOpacity>
      </View>

      {/* Date Scroller */}
      <View style={styles.datesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesScroll}>
          <View style={[styles.dateBox, styles.dateBoxActive]}>
            <Text variant="sm" weight="bold" color={theme.colors.whiteSnow}>Hoje</Text>
            <Text variant="lg" weight="bold" color={theme.colors.whiteSnow}>14</Text>
          </View>
          <View style={styles.dateBox}>
            <Text variant="sm" color={theme.colors.readingGraphite}>Seg</Text>
            <Text variant="lg" color={theme.colors.readingGraphite}>13</Text>
          </View>
          <View style={styles.dateBox}>
            <Text variant="sm" color={theme.colors.readingGraphite}>Dom</Text>
            <Text variant="lg" color={theme.colors.readingGraphite}>12</Text>
          </View>
          <View style={styles.dateBox}>
            <Text variant="sm" color={theme.colors.readingGraphite}>Sáb</Text>
            <Text variant="lg" color={theme.colors.readingGraphite}>11</Text>
          </View>
        </ScrollView>
      </View>

      {/* Entries */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.entriesList}>
        {mockEntries.map((entry, index) => (
          <View key={entry.id} style={styles.entryRow}>
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineIcon, { backgroundColor: entry.iconBg }]}>
                <Ionicons name={entry.icon as any} size={20} color={entry.iconColor || theme.colors.readingGraphite} />
              </View>
              {index !== mockEntries.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <Card style={styles.entryCard} padding="lg">
              <View style={styles.entryHeader}>
                <Text variant="sm" weight="bold" color={theme.colors.gray500} style={styles.entryInfo}>
                  {entry.date} • {entry.author}
                </Text>
                <View style={styles.moodTag}>
                  <Text variant="sm" weight="bold" color={theme.colors.readingGraphite}>{entry.mood}</Text>
                </View>
              </View>
              <Text variant="md" color={theme.colors.readingGraphite} style={styles.entryText}>
                {entry.text}
              </Text>

              {entry.resources && (
                <View style={styles.resourcesBox}>
                  <Text variant="sm" color={theme.colors.gray500}>Memórias usadas:</Text>
                  <View style={styles.resourcesIcons}>
                    {entry.resources.map(res => (
                      <View key={res} style={styles.resourceIconBg}>
                        <Ionicons name={res as any} size={14} color={theme.colors.blueMemory} />
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </Card>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
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
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.blueMemory,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datesContainer: {
    marginBottom: theme.spacing.xl,
  },
  datesScroll: {
    gap: theme.spacing.sm,
  },
  dateBox: {
    width: 60,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#EAE2D6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateBoxActive: {
    backgroundColor: theme.colors.blueMemory,
    borderColor: theme.colors.blueMemory,
  },
  entriesList: {
    paddingBottom: 100, // tabbar space
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
    borderRadius: 20,
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
    backgroundColor: '#E6F0EB', // light green mock
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
    borderRadius: 12,
  },
  entryText: {
    lineHeight: 24,
  },
  resourcesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
  },
  resourcesIcons: {
    flexDirection: 'row',
    marginLeft: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  resourceIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3E6D3', // very light mock sand
    justifyContent: 'center',
    alignItems: 'center',
  },
});
