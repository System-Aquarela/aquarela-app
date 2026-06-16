import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/store/AppContext';

export default function VisitScreen() {
  const router = useRouter();
  const { selectedProfile } = useApp();

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
        
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/visits/summary')}>
          <Card style={styles.historyCard}>
            <View style={styles.historyIconWrapper}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.calmSuccess} />
            </View>
            <View style={styles.historyCardInfo}>
              <Text variant="md" weight="bold">01/10/2023 - Boa interação</Text>
              <Text variant="sm" color={theme.colors.gray500}>Por Familiar Principal</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.gray400} />
          </Card>
        </TouchableOpacity>
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
