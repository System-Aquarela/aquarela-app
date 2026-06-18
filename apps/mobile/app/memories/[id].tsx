import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { memoriesService } from '../../src/services/memories.service';
import { Memory } from '../../src/types/memory.types';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function MemoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [memory, setMemory] = useState<Memory | null>(null);

  useEffect(() => {
    loadMemory();
  }, [id]);

  const loadMemory = async () => {
    if (typeof id !== 'string') return;
    setMemory(await memoriesService.getMemory(id));
  };

  const handleToggleFavorite = async () => {
    if (!memory) return;
    await memoriesService.toggleFavorite(memory.id);
    loadMemory(); // reload
  };

  if (!memory) return null;

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} onPress={() => router.back()} />
        <Ionicons 
          name={memory.isFavorite ? "heart" : "heart-outline"} 
          size={28} 
          color={memory.isFavorite ? theme.colors.softTerracotta : theme.colors.gray400} 
          onPress={handleToggleFavorite} 
        />
      </View>

      {memory.mediaType === 'foto' && memory.imageUrl ? <Image source={{ uri: memory.imageUrl }} style={styles.memoryImage} resizeMode="cover" /> : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name={memory.mediaType === 'documento' ? 'document-text-outline' : memory.mediaType === 'audio' || memory.mediaType === 'musica' ? 'musical-notes-outline' : 'image'} size={60} color={theme.colors.gray300} />
          <Text variant="sm" color={theme.colors.gray500} style={styles.mediaLabel}>{memory.mediaType ? `Mídia: ${memory.mediaType}` : 'Memória sem anexo'}</Text>
        </View>
      )}

      <Text variant="xxl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>
        {memory.title}
      </Text>
      
      <View style={styles.badges}>
        <View style={styles.badge}>
          <Text variant="sm">{memory.period}</Text>
        </View>
        <View style={styles.badge}>
          <Text variant="sm">{memory.category}</Text>
        </View>
      </View>

      <Card style={styles.section}>
        <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.sectionTitle}>
          História
        </Text>
        <Text variant="md" style={styles.paragraph}>
          {memory.story}
        </Text>
      </Card>

      <Card style={styles.section}>
        <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.sectionTitle}>
          Para iniciar a conversa
        </Text>
        <Text variant="md" style={styles.phrase}>
          "{memory.suggestedPhrase}"
        </Text>
      </Card>

      <Card style={styles.section}>
        <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.sectionTitle}>
          Pessoas envolvidas
        </Text>
        <Text variant="md">
          {memory.peopleInvolved.length > 0 ? memory.peopleInvolved.join(', ') : 'Nenhuma pessoa específica.'}
        </Text>
      </Card>

      <Card style={styles.section}>
        <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.sectionTitle}>
          Reação anterior
        </Text>
        <Text variant="md" color={theme.colors.gray500}>
          {memory.previousReaction}
        </Text>
      </Card>

      <Button title="Usar na Visita" onPress={() => router.push('/visits/active')} style={styles.button} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  memoryImage: { width: '100%', height: 240, borderRadius: theme.radius.lg, marginBottom: theme.spacing.xl },
  mediaLabel: { marginTop: theme.spacing.sm },
  title: {
    marginBottom: theme.spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  badge: {
    backgroundColor: theme.colors.gray200,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.xl,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
  },
  paragraph: {
    lineHeight: 24,
  },
  phrase: {
    fontStyle: 'italic',
    color: theme.colors.sereneGreen,
    fontWeight: '500',
  },
  button: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});
