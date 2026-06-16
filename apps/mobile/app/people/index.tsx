import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { mockPeople } from '../../src/mocks/people.mock';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function PeopleScreen() {
  const router = useRouter();

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} onPress={() => router.back()} />
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>
          Pessoas importantes
        </Text>
      </View>

      <FlatList
        data={mockPeople}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/people/${item.id}`)} activeOpacity={0.8}>
            <Card style={styles.card}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={24} color={theme.colors.whiteSnow} />
              </View>
              <View style={styles.cardInfo}>
                <Text variant="lg" weight="bold" color={theme.colors.readingGraphite}>{item.name}</Text>
                <Text variant="sm" color={theme.colors.gray500}>{item.relation}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.gray400} />
            </Card>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    marginLeft: theme.spacing.md,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.sereneGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
});
