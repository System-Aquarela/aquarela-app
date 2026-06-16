import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function RoadmapScreen() {
  const router = useRouter();

  return (
    <Screen scrollable>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.blueMemory} />
        </TouchableOpacity>
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory}>
          Aquarela
        </Text>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={20} color={theme.colors.gray400} />
        </View>
      </View>

      <Text variant="xxl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>
        Preparar visita para Dona Lúcia
      </Text>
      <Text variant="md" color={theme.colors.gray500} style={styles.subtitle}>
        Reserve um momento para se organizar antes do encontro.
      </Text>

      {/* O que levar */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconBg, { backgroundColor: '#3B5955' }]}>
            <Ionicons name="bag-handle" size={20} color={theme.colors.whiteSnow} />
          </View>
          <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.sectionTitle}>
            O que levar
          </Text>
        </View>

        <View style={styles.itemBox}>
          <View style={styles.itemIconImageMock}>
            <Ionicons name="image-outline" size={20} color={theme.colors.blueMemory} />
          </View>
          <View>
            <Text variant="md" weight="bold" color={theme.colors.readingGraphite}>Foto de Ubatuba</Text>
            <Text variant="sm" color={theme.colors.gray500}>Álbum de 1985</Text>
          </View>
        </View>

        <View style={styles.itemBox}>
          <View style={[styles.itemIconBg, { backgroundColor: '#B8E5D3' }]}>
            <Ionicons name="musical-notes" size={20} color={theme.colors.readingGraphite} />
          </View>
          <View>
            <Text variant="md" weight="bold" color={theme.colors.readingGraphite}>Playlist favorita</Text>
            <Text variant="sm" color={theme.colors.gray500}>Samba Clássico</Text>
          </View>
        </View>
      </Card>

      {/* Assuntos Favoritos */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconBg, { backgroundColor: '#21423B' }]}>
            <Ionicons name="heart" size={20} color={theme.colors.whiteSnow} />
          </View>
          <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.sectionTitle}>
            Assuntos favoritos
          </Text>
        </View>

        <View style={styles.listItem}>
          <Ionicons name="checkmark-circle-outline" size={24} color={theme.colors.sereneGreen} />
          <Text variant="md" color={theme.colors.readingGraphite} style={styles.listText}>O jardim de rosas</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="checkmark-circle-outline" size={24} color={theme.colors.sereneGreen} />
          <Text variant="md" color={theme.colors.readingGraphite} style={styles.listText}>As receitas de domingo</Text>
        </View>
        <View style={styles.listItem}>
          <Ionicons name="checkmark-circle-outline" size={24} color={theme.colors.sereneGreen} />
          <Text variant="md" color={theme.colors.readingGraphite} style={styles.listText}>Histórias da infância</Text>
        </View>
      </Card>

      {/* Assuntos a Evitar */}
      <View style={styles.dangerBox}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconBg, { backgroundColor: '#FDE4DE' }]}>
            <Ionicons name="warning-outline" size={20} color={theme.colors.calmError} />
          </View>
          <Text variant="lg" weight="bold" color={theme.colors.readingGraphite} style={styles.sectionTitle}>
            Assuntos a Evitar
          </Text>
        </View>

        <Text variant="sm" color={theme.colors.gray500} style={styles.dangerDesc}>
          Para manter o ambiente tranquilo, sugerimos não focar nestes temas hoje.
        </Text>

        <View style={styles.dangerItem}>
          <View style={styles.dangerDot} />
          <Text variant="md" color={theme.colors.gray500}>Estadias no hospital</Text>
        </View>
        <View style={styles.dangerItem}>
          <View style={styles.dangerDot} />
          <Text variant="md" color={theme.colors.gray500}>Obras na casa da praia</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/visits/active')}>
        <Ionicons name="play" size={20} color={theme.colors.whiteSnow} style={styles.btnIcon} />
        <Text variant="md" weight="bold" color={theme.colors.whiteSnow}>Iniciar Visita</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  sectionCard: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    marginLeft: theme.spacing.sm,
  },
  itemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: '#EAE2D6',
  },
  itemIconImageMock: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: '#EAE2D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  itemIconBg: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  listText: {
    marginLeft: theme.spacing.sm,
  },
  dangerBox: {
    backgroundColor: '#F9ECE5',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#EBD1CA',
    marginBottom: theme.spacing.xl,
  },
  dangerDesc: {
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  dangerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.calmError,
    marginRight: theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: theme.colors.blueMemory,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    borderRadius: 24,
    marginBottom: theme.spacing.xl,
  },
  btnIcon: {
    marginRight: theme.spacing.sm,
  },
});
