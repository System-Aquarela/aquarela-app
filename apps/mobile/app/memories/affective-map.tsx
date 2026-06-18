import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { memoriesService } from '../../src/services/memories.service';
import { peopleService } from '../../src/services/people.service';
import { Memory } from '../../src/types/memory.types';
import { Person } from '../../src/types/person.types';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/store/AppContext';

export default function AffectiveMapScreen() {
  const router = useRouter();
  const { selectedProfile } = useApp();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    Promise.all([memoriesService.getMemories(), peopleService.getPeople()]).then(([memoryData, peopleData]) => {
      setMemories(memoryData);
      setPeople(peopleData);
    });
  }, []);

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} onPress={() => router.back()} />
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>Mapa afetivo</Text>
      </View>

      <Card style={styles.mapCard} padding="lg">
        <View style={styles.centerNode}>
          <Ionicons name="heart" size={28} color={theme.colors.whiteSnow} />
          <Text variant="sm" weight="bold" color={theme.colors.whiteSnow} align="center">{selectedProfile?.nickname || selectedProfile?.name}</Text>
        </View>
        <View style={styles.nodesWrap}>
          {people.slice(0, 4).map(person => (
            <View key={person.id} style={styles.node}>
              <Ionicons name="person-outline" size={18} color={theme.colors.blueMemory} />
              <Text variant="xs" weight="bold" color={theme.colors.readingGraphite} align="center">{person.name}</Text>
            </View>
          ))}
          {memories.slice(0, 4).map(memory => (
            <View key={memory.id} style={[styles.node, styles.memoryNode]}>
              <Ionicons name="images-outline" size={18} color={theme.colors.softTerracotta} />
              <Text variant="xs" weight="bold" color={theme.colors.readingGraphite} align="center">{memory.category}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Text variant="md" color={theme.colors.gray500} style={styles.description}>
        Pessoas e temas são formados a partir dos vínculos e memórias deste perfil. A leitura não depende só de cor: cada item também tem ícone e texto.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xl },
  title: { marginLeft: theme.spacing.md },
  mapCard: { alignItems: 'center', marginBottom: theme.spacing.lg },
  centerNode: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: theme.colors.blueMemory,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  nodesWrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: theme.spacing.md },
  node: {
    width: 88,
    minHeight: 76,
    borderRadius: 28,
    backgroundColor: theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  memoryNode: { backgroundColor: '#F9E7E2' },
  description: { lineHeight: 22 },
});
