import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { mockPeople } from '../../src/mocks/people.mock';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const person = mockPeople.find((p: any) => p.id === id);

  if (!person) return null;

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} onPress={() => router.back()} />
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={60} color={theme.colors.whiteSnow} />
        </View>
        <Text variant="xxl" weight="bold" color={theme.colors.blueMemory} style={styles.name}>
          {person.name}
        </Text>
        <Text variant="lg" color={theme.colors.gray500}>
          {person.relation}
        </Text>
      </View>

      <Card style={styles.section}>
        <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.sectionTitle}>
          Descrição
        </Text>
        <Text variant="md" style={styles.text}>
          {person.description}
        </Text>
      </Card>

      {person.supportPhrase && (
        <Card style={styles.sectionPhrase}>
          <View style={styles.row}>
            <Ionicons name="chatbubble-ellipses" size={24} color={theme.colors.sereneGreen} />
            <Text variant="lg" weight="bold" color={theme.colors.sereneGreen} style={styles.sectionTitleIcon}>
              Frase de apoio
            </Text>
          </View>
          <Text variant="md" style={styles.phrase}>
            "{person.supportPhrase}"
          </Text>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.lg,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.sereneGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  name: {
    marginBottom: theme.spacing.xs,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionPhrase: {
    marginBottom: theme.spacing.md,
    backgroundColor: '#F0FDF4', // Very light green
    borderColor: theme.colors.sereneGreen,
    borderWidth: 1,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
  },
  sectionTitleIcon: {
    marginLeft: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  text: {
    lineHeight: 24,
  },
  phrase: {
    fontStyle: 'italic',
    fontWeight: '500',
    color: theme.colors.sereneGreen,
  },
});
