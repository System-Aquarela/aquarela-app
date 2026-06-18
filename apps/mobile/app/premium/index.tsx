import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

const benefits = ['Backup em nuvem', 'Exportação PDF', 'Relatórios avançados', 'Mais familiares convidados'];

export default function PremiumScreen() {
  const router = useRouter();

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} onPress={() => router.back()} />
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>Plano Premium</Text>
      </View>

      <Card style={styles.hero} padding="xl">
        <Ionicons name="star-outline" size={34} color={theme.colors.softTerracotta} />
        <Text variant="xxl" weight="bold" color={theme.colors.blueMemory} align="center" style={styles.heroTitle}>Plano Premium</Text>
        <Text variant="md" color={theme.colors.gray500} align="center" style={styles.description}>
          Tela demonstrativa para evolução comercial, sem pagamento real e sem bloquear funções essenciais de cuidado.
        </Text>
      </Card>

      {benefits.map(item => (
        <Card key={item} style={styles.benefit} padding="lg">
          <Ionicons name="checkmark-circle-outline" size={24} color={theme.colors.sereneGreen} />
          <Text variant="md" weight="bold" color={theme.colors.readingGraphite} style={styles.benefitText}>{item}</Text>
        </Card>
      ))}

      <Button title="Assinaturas ainda não habilitadas" disabled style={styles.button} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xl },
  title: { marginLeft: theme.spacing.md },
  hero: { alignItems: 'center', marginBottom: theme.spacing.lg },
  heroTitle: { marginVertical: theme.spacing.sm },
  description: { lineHeight: 22 },
  benefit: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md },
  benefitText: { marginLeft: theme.spacing.md },
  button: { marginTop: theme.spacing.lg },
});
