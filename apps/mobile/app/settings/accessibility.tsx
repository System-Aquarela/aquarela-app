import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAccessibility } from '../../src/store/AccessibilityContext';

export default function AccessibilityScreen() {
  const router = useRouter();
  const { largeText, highContrast, setLargeText, setHighContrast } = useAccessibility();

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} onPress={() => router.back()} />
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>
          Modo Acessível
        </Text>
      </View>

      <Text variant="md" color={theme.colors.gray500} style={styles.description}>
        Ajuste as configurações para facilitar a leitura e o uso do aplicativo.
      </Text>

      <Card style={styles.section}>
        <ToggleRow 
          label="Textos maiores" 
          value={largeText} 
          onToggle={() => setLargeText(!largeText)} 
          icon="text" 
          color={theme.colors.blueMemory}
        />
        <ToggleRow 
          label="Alto contraste" 
          value={highContrast} 
          onToggle={() => setHighContrast(!highContrast)} 
          icon="contrast" 
          color={theme.colors.blueMemory}
        />
      </Card>
    </Screen>
  );
}

function ToggleRow({ label, value, onToggle, icon, color }: { label: string, value: boolean, onToggle: () => void, icon: any, color: string }) {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8} style={styles.toggleRow}>
      <View style={styles.toggleLabel}>
        <Ionicons name={icon} size={24} color={color} />
        <Text variant="md" weight="semibold" style={styles.toggleText}>{label}</Text>
      </View>
      <Ionicons 
        name={value ? "toggle" : "toggle-outline"} 
        size={36} 
        color={value ? theme.colors.sereneGreen : theme.colors.gray300} 
      />
    </TouchableOpacity>
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
  section: {
    marginBottom: theme.spacing.lg,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  toggleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    marginLeft: theme.spacing.md,
  },
});
