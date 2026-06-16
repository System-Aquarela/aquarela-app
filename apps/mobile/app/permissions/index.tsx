import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function PermissionsScreen() {
  const router = useRouter();

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} onPress={() => router.back()} />
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>
          Família e Permissões
        </Text>
      </View>

      <Text variant="md" color={theme.colors.gray500} style={styles.description}>
        Gerencie quem tem acesso ao perfil e quais ações cada pessoa pode realizar.
      </Text>

      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color={theme.colors.whiteSnow} />
          </View>
          <View style={styles.info}>
            <Text variant="lg" weight="bold">Familiar Principal</Text>
            <Text variant="sm" color={theme.colors.gray500}>Administrador familiar</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.avatarPlaceholderGuest}>
            <Ionicons name="person" size={24} color={theme.colors.readingGraphite} />
          </View>
          <View style={styles.info}>
            <Text variant="lg" weight="bold">João (Filho)</Text>
            <Text variant="sm" color={theme.colors.gray500}>Familiar</Text>
          </View>
        </View>
      </Card>

      <Button title="Convidar membro" onPress={() => {}} style={styles.button} />
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
  },
  card: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.blueMemory,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarPlaceholderGuest: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  info: {
    flex: 1,
  },
  button: {
    marginTop: theme.spacing.lg,
  },
});
