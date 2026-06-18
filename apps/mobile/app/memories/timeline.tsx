import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { memoriesService } from '../../src/services/memories.service';
import { Memory } from '../../src/types/memory.types';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function TimelineScreen() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    memoriesService.getMemories().then(setMemories);
  }, []);

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} onPress={() => router.back()} />
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>Linha do tempo</Text>
      </View>

      {memories.map((memory, index) => (
        <View key={memory.id} style={styles.row}>
          <View style={styles.timeline}>
            <View style={styles.dot} />
            {index !== memories.length - 1 && <View style={styles.line} />}
          </View>
          <TouchableOpacity style={styles.cardWrap} onPress={() => router.push(`/memories/${memory.id}`)}>
            <Card padding="lg">
              <Text variant="sm" weight="bold" color={theme.colors.softTerracotta}>{memory.period}</Text>
              <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.cardTitle}>{memory.title}</Text>
              <Text variant="md" color={theme.colors.gray500}>{memory.category}</Text>
            </Card>
          </TouchableOpacity>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xl },
  title: { marginLeft: theme.spacing.md },
  row: { flexDirection: 'row', marginBottom: theme.spacing.md },
  timeline: { width: 34, alignItems: 'center' },
  dot: { width: 18, height: 18, borderRadius: 9, backgroundColor: theme.colors.softTerracotta },
  line: { width: 2, flex: 1, backgroundColor: theme.colors.gray200, marginTop: theme.spacing.xs },
  cardWrap: { flex: 1 },
  cardTitle: { marginVertical: theme.spacing.xs },
});
