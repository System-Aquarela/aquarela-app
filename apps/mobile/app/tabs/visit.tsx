import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/store/AppContext';
import { visitsService } from '../../src/services/visits.service';
import { VisitRecord } from '../../src/types/visit.types';

export default function VisitScreen() {
  const router = useRouter();
  const { selectedProfile } = useApp();
  const [visits, setVisits] = useState<VisitRecord[]>([]);

  useEffect(() => { visitsService.getVisits().then(setVisits).catch(() => setVisits([])); }, []);

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory}>
          Modo Visita
        </Text>
        <Text variant="md" color={theme.colors.gray500}>
          Prepare-se para visitar {selectedProfile?.nickname}
        </Text>
      </View>

      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={24} color={theme.colors.blueMemory} />
          <Text variant="md" style={styles.infoText}>
            O modo visita gera um roteiro baseado nas memórias mais positivas e evita temas sensíveis.
          </Text>
        </View>
      </Card>

      <Button 
        title="Gerar Roteiro" 
        onPress={() => router.push('/visits/roadmap')} 
        style={styles.mainButton}
      />

      <View style={styles.historySection}>
        <Text variant="lg" weight="bold" color={theme.colors.readingGraphite} style={styles.historyTitle}>
          Visitas anteriores
        </Text>
        
        {visits.length === 0 ? <Text variant="sm" color={theme.colors.gray500}>Nenhuma visita registrada ainda.</Text> : visits.map(visit => (
          <Card key={visit.id} style={styles.historyCard}>
            <View style={styles.historyIconWrapper}><Ionicons name={visit.generatedDiscomfort ? 'alert-circle' : 'checkmark-circle'} size={24} color={visit.generatedDiscomfort ? theme.colors.attention : theme.colors.calmSuccess} /></View>
            <View style={styles.historyCardInfo}>
              <Text variant="md" weight="bold">{new Date(visit.date).toLocaleDateString('pt-BR')} · {visit.generatedConversation ? 'Gerou conversa' : visit.generatedSmile ? 'Gerou sorriso' : 'Visita registrada'}</Text>
              <Text variant="sm" color={theme.colors.gray500} numberOfLines={2}>{visit.observation || 'Sem observação adicional.'}</Text>
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.xl,
  },
  infoCard: {
    backgroundColor: theme.colors.memoryLavender,
    marginBottom: theme.spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: theme.spacing.md,
    color: theme.colors.blueMemory,
  },
  mainButton: {
    marginBottom: theme.spacing.xl,
  },
  historySection: {
    marginTop: theme.spacing.md,
  },
  historyTitle: {
    marginBottom: theme.spacing.md,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  historyIconWrapper: {
    marginRight: theme.spacing.md,
  },
  historyCardInfo: {
    flex: 1,
  },
});
