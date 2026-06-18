import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';
import { memoriesService } from '../../src/services/memories.service';
import { Memory, MemoryCategory } from '../../src/types/memory.types';

const categories: Array<'Todas' | MemoryCategory> = [
  'Todas',
  'Infância',
  'Adolescência',
  'Vida adulta',
  'Família',
  'Trabalho',
  'Viagens',
  'Conquistas',
  'Músicas',
  'Documentos',
];

export default function MemoriesScreen() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [activeCategory, setActiveCategory] = useState<'Todas' | MemoryCategory>('Todas');

  useEffect(() => {
    loadMemories();
  }, []);

  async function loadMemories() {
    setMemories(await memoriesService.getMemories());
  }

  const filteredMemories = activeCategory === 'Todas'
    ? memories
    : memories.filter(memory => memory.category === activeCategory);

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="xl" weight="bold" color={theme.colors.blueMemory}>
            Biblioteca de Vida
          </Text>
          <Text variant="sm" color={theme.colors.gray500}>
            Memórias, linha do tempo, mapa afetivo e legados.
          </Text>
        </View>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/memories/create')}>
          <Ionicons name="add" size={24} color={theme.colors.whiteSnow} />
        </TouchableOpacity>
      </View>

      <View style={styles.quickRow}>
        <QuickAction title="Linha do tempo" icon="time-outline" onPress={() => router.push('/memories/timeline')} />
        <QuickAction title="Mapa afetivo" icon="share-social-outline" onPress={() => router.push('/memories/affective-map')} />
        <QuickAction title="Legados" icon="book-outline" onPress={() => router.push('/legacy')} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
        {categories.map(category => {
          const isActive = activeCategory === category;
          return (
            <TouchableOpacity
              key={category}
              style={[styles.filterPill, isActive && styles.filterActive]}
              onPress={() => setActiveCategory(category)}
            >
              <Text variant="sm" weight="bold" color={isActive ? theme.colors.whiteSnow : theme.colors.readingGraphite}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {filteredMemories.map(item => (
          <TouchableOpacity key={item.id} onPress={() => router.push(`/memories/${item.id}`)} activeOpacity={0.9}>
            <Card style={styles.card} padding="lg">
              <View style={styles.cardHeader}>
                {item.mediaType === 'foto' && item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.memoryImage} /> : (
                  <View style={styles.imageMock}><Ionicons name={getMediaIcon(item.mediaType)} size={24} color={theme.colors.blueMemory} /></View>
                )}
                <View style={styles.cardContent}>
                  <Text variant="sm" weight="bold" color={theme.colors.softTerracotta}>
                    {item.category}
                  </Text>
                  <Text variant="lg" weight="bold" color={theme.colors.readingGraphite} style={styles.cardTitle}>
                    {item.title}
                  </Text>
                  <Text variant="sm" color={theme.colors.gray500}>
                    {item.period}{item.location ? ` • ${item.location}` : ''}
                  </Text>
                </View>
              </View>
              <Text variant="md" color={theme.colors.gray500} style={styles.cardDesc}>
                {item.story}
              </Text>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Screen>
  );
}

function QuickAction({ title, icon, onPress }: { title: string; icon: any; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <Ionicons name={icon} size={20} color={theme.colors.blueMemory} />
      <Text variant="xs" weight="bold" color={theme.colors.readingGraphite} align="center" style={styles.quickText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function getMediaIcon(mediaType?: string) {
  if (mediaType === 'audio') return 'mic-outline';
  if (mediaType === 'video') return 'videocam-outline';
  if (mediaType === 'documento') return 'document-text-outline';
  if (mediaType === 'musica') return 'musical-notes-outline';
  return 'images-outline';
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
  headerButton: {
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
    marginBottom: theme.spacing.md,
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
  filtersScroll: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  filterPill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.whiteSnow,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
  },
  filterActive: {
    backgroundColor: theme.colors.blueMemory,
    borderColor: theme.colors.blueMemory,
  },
  listContent: {
    paddingBottom: 110,
  },
  card: {
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  imageMock: {
    width: 58,
    height: 58,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.lightSand,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  memoryImage: { width: 58, height: 58, borderRadius: theme.radius.md, marginRight: theme.spacing.md },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    marginVertical: theme.spacing.xs,
  },
  cardDesc: {
    lineHeight: 21,
  },
});
