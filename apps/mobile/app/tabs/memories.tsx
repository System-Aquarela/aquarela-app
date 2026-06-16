import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function MemoriesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const mockMemories = [
    {
      id: '1',
      title: 'Viagem para Ubatuba 1998',
      desc: 'Um final de semana inesquecível com toda a família reunida na...',
      category: 'VIAGENS',
      color: '#CBB27A' // sand color image mock
    },
    {
      id: '2',
      title: 'Aniversário de 70 anos',
      desc: 'A surpresa que organizaram para mim. Nunca vou esquecer a...',
      category: 'FAMÍLIA',
      color: '#653B25' // dark brown image mock
    },
    {
      id: '3',
      title: 'Jardim da casa antiga',
      desc: 'As roseiras que eu mesma plantei na primavera de 1985. Como e...',
      category: 'CASA',
      color: '#416B4A' // green image mock
    }
  ];

  return (
    <Screen style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={24} color={theme.colors.gray400} />
        </View>
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory}>
          Aquarela
        </Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={28} color={theme.colors.blueMemory} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={theme.colors.gray400} />
        <Text variant="md" color={theme.colors.gray400} style={styles.searchText}>Buscar memórias...</Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          <View style={[styles.filterPill, styles.filterActive]}>
            <Text variant="md" weight="bold" color={theme.colors.whiteSnow}>Todas</Text>
          </View>
          <View style={styles.filterPill}>
            <Text variant="md" weight="bold" color={theme.colors.readingGraphite}>Família</Text>
          </View>
          <View style={styles.filterPill}>
            <Text variant="md" weight="bold" color={theme.colors.readingGraphite}>Viagens</Text>
          </View>
          <View style={styles.filterPill}>
            <Text variant="md" weight="bold" color={theme.colors.readingGraphite}>Casa</Text>
          </View>
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {mockMemories.map(item => (
          <TouchableOpacity key={item.id} onPress={() => router.push(`/memories/${item.id}`)} activeOpacity={0.9}>
            <Card style={[styles.card, { padding: 0 }]}>
              <View style={[styles.imageMock, { backgroundColor: item.color }]} />
              <View style={styles.cardContent}>
                <Text variant="sm" weight="bold" color={theme.colors.blueMemory} style={styles.cardCategory}>
                  {item.category}
                </Text>
                <Text variant="lg" weight="bold" color={theme.colors.readingGraphite} style={styles.cardTitle}>
                  {item.title}
                </Text>
                <Text variant="md" color={theme.colors.gray500} style={styles.cardDesc}>
                  {item.desc}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/memories/create')}>
        <Ionicons name="add" size={32} color={theme.colors.whiteSnow} />
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.whiteSnow,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  searchText: {
    marginLeft: theme.spacing.sm,
  },
  filtersContainer: {
    marginBottom: theme.spacing.lg,
  },
  filtersScroll: {
    gap: theme.spacing.sm,
  },
  filterPill: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    backgroundColor: theme.colors.whiteSnow,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
  },
  filterActive: {
    backgroundColor: theme.colors.blueMemory,
    borderColor: theme.colors.blueMemory,
  },
  listContent: {
    paddingBottom: 100, // space for fab and tabbar
  },
  card: {
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  imageMock: {
    height: 160,
    width: '100%',
  },
  cardContent: {
    padding: theme.spacing.lg,
  },
  cardCategory: {
    marginBottom: theme.spacing.xs,
  },
  cardTitle: {
    marginBottom: theme.spacing.xs,
  },
  cardDesc: {
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.lg,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.blueMemory,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});
