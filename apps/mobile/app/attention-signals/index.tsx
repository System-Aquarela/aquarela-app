import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function AttentionSignalsScreen() {
  const router = useRouter();

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} onPress={() => router.back()} />
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>
          Sinais de Atenção
        </Text>
      </View>

      <Text variant="md" color={theme.colors.gray500} style={styles.description}>
        Estes sinais são baseados nas observações do diário. O aplicativo não faz diagnósticos médicos, apenas auxilia a família no acompanhamento diário.
      </Text>

      <Card style={styles.cardInfo}>
        <View style={styles.row}>
          <Ionicons name="information-circle" size={28} color={theme.colors.attention} />
          <Text variant="lg" weight="bold" color={theme.colors.attention} style={styles.cardTitle}>
            Mudança observada
          </Text>
        </View>
        <Text variant="md" style={styles.cardText}>
          Nos últimos registros, houve menor interação. Vale observar com cuidado e conversar com a família ou cuidador responsável.
        </Text>
      </Card>

      <Card style={styles.cardNormal}>
        <View style={styles.row}>
          <Ionicons name="checkmark-circle" size={28} color={theme.colors.calmSuccess} />
          <Text variant="lg" weight="bold" color={theme.colors.calmSuccess} style={styles.cardTitle}>
            Humor e Orientação
          </Text>
        </View>
        <Text variant="md" style={styles.cardText}>
          Os registros de humor e orientação permanecem estáveis e semelhantes às semanas anteriores.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    marginLeft: theme.spacing.md,
  },
  description: {
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  cardInfo: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.lightYellow,
  },
  cardNormal: {
    marginBottom: theme.spacing.md,
    backgroundColor: '#F0FDF4',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    marginLeft: theme.spacing.sm,
  },
  cardText: {
    lineHeight: 24,
  },
});
