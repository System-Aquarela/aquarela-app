import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const router = useRouter();

  const settingsOptions = [
    { id: '1', title: 'Editar perfil acompanhado', icon: 'person-outline', route: '/profiles/manage?mode=edit' },
    { id: '4', title: 'Acessibilidade e aparência', icon: 'eye-outline', route: '/settings/accessibility' },
    { id: '5', title: 'Privacidade e segurança', icon: 'lock-closed-outline', route: '/settings/privacy' },
    { id: '6', title: 'Família e permissões', icon: 'key-outline', route: '/permissions/index' },
    { id: '7', title: 'Plano Premium', icon: 'star-outline', route: '/premium' },
  ];

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} onPress={() => router.back()} />
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>
          Configurações
        </Text>
      </View>

      <Card padding="sm">
        {settingsOptions.map((opt, index) => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.optionRow, index !== settingsOptions.length - 1 && styles.borderBottom]}
            onPress={() => router.push(opt.route as any)}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <Ionicons name={opt.icon as any} size={24} color={theme.colors.blueMemory} />
              <Text variant="md" weight="medium" style={styles.optionText}>{opt.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.gray400} />
          </TouchableOpacity>
        ))}
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
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: theme.spacing.md,
  },
});
