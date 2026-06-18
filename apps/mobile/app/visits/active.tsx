import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Button } from '../../src/components/ui/Button';
import { theme } from '../../src/design/theme';
import { memoriesService } from '../../src/services/memories.service';
import { Memory } from '../../src/types/memory.types';

export default function ActiveVisitScreen() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [index, setIndex] = useState(0);
  const [smile, setSmile] = useState(false);
  const [conversation, setConversation] = useState(false);
  const [discomfort, setDiscomfort] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    memoriesService.getMemories()
      .then(items => setMemories(items.filter(item => !item.isSensitive).sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite))))
      .finally(() => setLoading(false));
  }, []);

  const memory = memories[index];
  if (loading) return <Screen style={styles.center}><ActivityIndicator size="large" color={theme.colors.blueMemory} /></Screen>;
  if (!memory) return (
    <Screen style={styles.center}>
      <Ionicons name="images-outline" size={54} color={theme.colors.gray400} />
      <Text variant="lg" weight="bold" align="center" style={styles.emptyText}>Adicione uma memória antes de iniciar a visita.</Text>
      <Button title="Criar memória" onPress={() => router.replace('/memories/create')} />
    </Screen>
  );

  function finish() {
    router.push(`/visits/summary?smile=${smile}&conversation=${conversation}&discomfort=${discomfort}` as any);
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Encerrar visita"><Ionicons name="close" size={28} color={theme.colors.blueMemory} /></TouchableOpacity>
        <View style={styles.headerCenter}><Text variant="lg" weight="bold">Visita em andamento</Text><Text variant="xs" color={theme.colors.gray500}>{index + 1} de {memories.length}</Text></View>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.card}>
        {memory.mediaType === 'foto' && memory.imageUrl ? <Image source={{ uri: memory.imageUrl }} style={styles.image} /> : (
          <View style={styles.placeholder}><Ionicons name="images-outline" size={70} color={theme.colors.blueMemory} /></View>
        )}
        <View style={styles.memoryContent}>
          <Text variant="xl" weight="bold" color={theme.colors.blueMemory}>{memory.title}</Text>
          <Text variant="sm" color={theme.colors.gray500} style={styles.period}>{memory.period}</Text>
          <Text variant="md" style={styles.story} numberOfLines={4}>{memory.story}</Text>
          <View style={styles.prompt}><Ionicons name="chatbubble-ellipses-outline" size={20} color={theme.colors.sereneGreen} /><Text variant="sm" color={theme.colors.sereneGreen} style={styles.promptText}>{memory.suggestedPhrase}</Text></View>
        </View>
      </View>

      <View style={styles.reactions}>
        <Reaction label="Sorriu" icon="happy-outline" active={smile} onPress={() => setSmile(value => !value)} />
        <Reaction label="Conversou" icon="chatbubbles-outline" active={conversation} onPress={() => setConversation(value => !value)} />
        <Reaction label="Desconforto" icon="warning-outline" active={discomfort} danger onPress={() => setDiscomfort(value => !value)} />
      </View>

      <View style={styles.navigation}>
        <TouchableOpacity style={[styles.navButton, index === 0 && styles.disabled]} onPress={() => setIndex(value => Math.max(0, value - 1))} disabled={index === 0}><Ionicons name="chevron-back" size={28} color={theme.colors.readingGraphite} /></TouchableOpacity>
        <Button title="Finalizar visita" onPress={finish} fullWidth={false} style={styles.finishButton} />
        <TouchableOpacity style={[styles.navButton, index === memories.length - 1 && styles.disabled]} onPress={() => setIndex(value => Math.min(memories.length - 1, value + 1))} disabled={index === memories.length - 1}><Ionicons name="chevron-forward" size={28} color={theme.colors.readingGraphite} /></TouchableOpacity>
      </View>
    </Screen>
  );
}

function Reaction({ label, icon, active, danger, onPress }: { label: string; icon: any; active: boolean; danger?: boolean; onPress: () => void }) {
  const activeColor = danger ? theme.colors.calmError : theme.colors.sereneGreen;
  return <TouchableOpacity style={[styles.reaction, active && { backgroundColor: activeColor }]} onPress={onPress} accessibilityRole="checkbox" accessibilityState={{ checked: active }}><Ionicons name={icon} size={24} color={active ? theme.colors.whiteSnow : activeColor} /><Text variant="xs" weight="bold" color={active ? theme.colors.whiteSnow : theme.colors.readingGraphite} style={styles.reactionText}>{label}</Text></TouchableOpacity>;
}

const styles = StyleSheet.create({
  screen: { paddingBottom: theme.spacing.md },
  center: { justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginVertical: theme.spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.lg },
  headerCenter: { alignItems: 'center' },
  card: { backgroundColor: theme.colors.whiteSnow, borderRadius: theme.radius.lg, overflow: 'hidden', flex: 1, minHeight: 390 },
  image: { width: '100%', height: 230 },
  placeholder: { width: '100%', height: 230, backgroundColor: theme.colors.lightSand, alignItems: 'center', justifyContent: 'center' },
  memoryContent: { padding: theme.spacing.lg },
  period: { marginTop: theme.spacing.xs },
  story: { marginTop: theme.spacing.md, lineHeight: 22 },
  prompt: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#EEF7F3', padding: theme.spacing.md, borderRadius: theme.radius.md, marginTop: theme.spacing.md },
  promptText: { flex: 1, marginLeft: theme.spacing.sm, lineHeight: 19 },
  reactions: { flexDirection: 'row', gap: theme.spacing.sm, marginVertical: theme.spacing.md },
  reaction: { flex: 1, minHeight: 64, borderRadius: theme.radius.md, backgroundColor: theme.colors.whiteSnow, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xs },
  reactionText: { marginTop: 4 },
  navigation: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  navButton: { width: 52, height: 52, borderRadius: 26, backgroundColor: theme.colors.lightSand, alignItems: 'center', justifyContent: 'center' },
  finishButton: { flex: 1 },
  disabled: { opacity: 0.35 },
});
