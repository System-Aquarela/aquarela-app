import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} onPress={() => router.back()} />
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>
          Segurança e Privacidade
        </Text>
      </View>

      <Card style={styles.section}>
        <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.sectionTitle}>
          Privacidade dos Dados
        </Text>
        <Text variant="md" style={styles.paragraph}>
          O Aquarela leva a privacidade da sua família a sério. Todas as memórias e registros do diário são privados e compartilhados apenas com as pessoas que você convidar.
        </Text>
        <Text variant="md" style={styles.paragraph}>
          Nós não vendemos seus dados para terceiros e não utilizamos suas fotos para fins não relacionados ao aplicativo.
        </Text>
      </Card>

      <Card style={styles.section}>
        <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.sectionTitle}>
          Importante
        </Text>
        <Text variant="md" style={styles.paragraph}>
          O aplicativo Aquarela não faz diagnósticos médicos e não substitui o acompanhamento de profissionais de saúde qualificados. Nosso objetivo é fortalecer os vínculos familiares.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    marginLeft: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  paragraph: {
    marginBottom: theme.spacing.sm,
    lineHeight: 24,
  },
});
