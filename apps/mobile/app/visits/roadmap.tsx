import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { theme } from '../../src/design/theme';
import { useApp } from '../../src/store/AppContext';
import { memoriesService } from '../../src/services/memories.service';
import { Memory } from '../../src/types/memory.types';

export default function RoadmapScreen() {
  const router = useRouter();
  const { selectedProfile } = useApp();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    memoriesService.getMemories()
      .then(items => setMemories(items.filter(item => !item.isSensitive).sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite)).slice(0, 3)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Screen scrollable contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Voltar"><Ionicons name="arrow-back" size={26} color={theme.colors.blueMemory} /></TouchableOpacity>
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory}>Preparar visita</Text>
        <View style={styles.avatar}><Text variant="sm" weight="bold" color={theme.colors.whiteSnow}>{selectedProfile?.name.slice(0, 1)}</Text></View>
      </View>

      <Text variant="xxl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>Visita para {selectedProfile?.nickname || selectedProfile?.name}</Text>
      <Text variant="md" color={theme.colors.gray500} style={styles.subtitle}>Um roteiro afetivo baseado nos registros reais deste perfil.</Text>

      <Card style={styles.section} padding="lg">
        <SectionTitle icon="images-outline" title="Memórias sugeridas" color={theme.colors.blueMemory} />
        {loading ? <ActivityIndicator color={theme.colors.blueMemory} /> : memories.length === 0 ? (
          <Text variant="sm" color={theme.colors.gray500}>Adicione uma memória para montar o roteiro.</Text>
        ) : memories.map(memory => (
          <TouchableOpacity key={memory.id} style={styles.memoryRow} onPress={() => router.push(`/memories/${memory.id}`)}>
            <View style={styles.memoryIcon}><Ionicons name={memory.isFavorite ? 'heart' : 'image-outline'} size={20} color={theme.colors.softTerracotta} /></View>
            <View style={styles.flex}><Text variant="md" weight="bold">{memory.title}</Text><Text variant="sm" color={theme.colors.gray500}>{memory.period}</Text></View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.gray400} />
          </TouchableOpacity>
        ))}
      </Card>

      <Card style={styles.section} padding="lg">
        <SectionTitle icon="chatbubbles-outline" title="Boas pontes de conversa" color={theme.colors.sereneGreen} />
        {(selectedProfile?.favoriteSubjects.length ? selectedProfile.favoriteSubjects : ['Pergunte sobre o dia e ofereça escolhas simples']).map(item => (
          <View key={item} style={styles.listRow}><Ionicons name="checkmark-circle" size={21} color={theme.colors.sereneGreen} /><Text variant="md" style={styles.listText}>{item}</Text></View>
        ))}
        {!!selectedProfile?.favoriteSongs.length && <Text variant="sm" color={theme.colors.gray500} style={styles.songHint}>Música sugerida: {selectedProfile.favoriteSongs[0]}</Text>}
      </Card>

      {!!selectedProfile?.sensitiveTopics.length && (
        <Card style={styles.warning} padding="lg">
          <SectionTitle icon="warning-outline" title="Assuntos para tratar com cuidado" color={theme.colors.attention} />
          {selectedProfile.sensitiveTopics.map(item => <View key={item} style={styles.listRow}><View style={styles.dot} /><Text variant="md" style={styles.listText}>{item}</Text></View>)}
        </Card>
      )}

      <Button title="Iniciar visita" icon={<Ionicons name="play" size={20} color={theme.colors.whiteSnow} />} onPress={() => router.push('/visits/active')} disabled={loading || memories.length === 0} />
    </Screen>
  );
}

function SectionTitle({ icon, title, color }: { icon: any; title: string; color: string }) {
  return <View style={styles.sectionTitle}><Ionicons name={icon} size={23} color={color} /><Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.sectionTitleText}>{title}</Text></View>;
}

const styles = StyleSheet.create({
  content: { paddingBottom: 48 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.xl },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: theme.colors.sereneGreen, alignItems: 'center', justifyContent: 'center' },
  title: { marginBottom: theme.spacing.xs },
  subtitle: { marginBottom: theme.spacing.xl, lineHeight: 22 },
  section: { marginBottom: theme.spacing.lg },
  warning: { marginBottom: theme.spacing.xl, backgroundColor: '#FFF7E8', borderWidth: 1, borderColor: '#F1D39E' },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md },
  sectionTitleText: { marginLeft: theme.spacing.sm },
  memoryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderBottomColor: theme.colors.gray100 },
  memoryIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.lightSand, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md },
  flex: { flex: 1 },
  listRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm },
  listText: { marginLeft: theme.spacing.sm, flex: 1, lineHeight: 21 },
  songHint: { marginTop: theme.spacing.sm, lineHeight: 20 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: theme.colors.attention },
});
