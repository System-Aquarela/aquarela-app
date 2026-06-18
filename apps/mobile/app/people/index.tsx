import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { peopleService } from '../../src/services/people.service';
import { Person } from '../../src/types/person.types';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function PeopleScreen() {
  const router = useRouter();
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    peopleService.getPeople().then(setPeople);
  }, []);

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} onPress={() => router.back()} />
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>
          Pessoas importantes
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/scanner/register')}>
          <Ionicons name="add" size={22} color={theme.colors.whiteSnow} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={people}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/people/${item.id}`)} activeOpacity={0.8}>
            <Card style={styles.card}>
              {item.photoUrl ? <Image source={{ uri: item.photoUrl }} style={styles.avatarImage} /> : (
                <View style={styles.avatarPlaceholder}><Ionicons name="person" size={24} color={theme.colors.whiteSnow} /></View>
              )}
              <View style={styles.cardInfo}>
                <Text variant="lg" weight="bold" color={theme.colors.readingGraphite}>{item.name}</Text>
                <Text variant="sm" color={theme.colors.gray500}>{item.relation} • {item.lastInteraction || 'sem interação recente'}</Text>
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
    flex: 1,
  },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.blueMemory,
    justifyContent: 'center',
    alignItems: 'center',
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
  avatarImage: { width: 50, height: 50, borderRadius: 25, marginRight: theme.spacing.md },
  cardInfo: {
    flex: 1,
  },
});
