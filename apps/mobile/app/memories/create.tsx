import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function CreateMemoryScreen() {
  const router = useRouter();

  return (
    <Screen scrollable>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="close" size={28} color={theme.colors.blueMemory} />
        </TouchableOpacity>
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.headerTitle}>
          Nova Memória
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Dots */}
      <View style={styles.progressContainer}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      {/* Titles */}
      <View style={styles.titlesContainer}>
        <Text variant="xxl" weight="bold" color={theme.colors.blueMemory} align="center" style={styles.mainTitle}>
          O que você quer registrar hoje?
        </Text>
        <Text variant="md" color={theme.colors.readingGraphite} align="center" style={styles.subtitle}>
          Escolha o tipo de memória para começar.
        </Text>
      </View>

      {/* Grid Options */}
      <View style={styles.grid}>
        <TouchableOpacity style={styles.optionCard} onPress={() => {}}>
          <View style={[styles.iconCircle, { backgroundColor: '#D4E6F1' }]}>
            <Ionicons name="camera" size={32} color={theme.colors.blueMemory} />
          </View>
          <Text variant="md" weight="bold" color={theme.colors.readingGraphite}>Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={() => {}}>
          <View style={[styles.iconCircle, { backgroundColor: '#D5F5E3' }]}>
            <Ionicons name="videocam" size={32} color={theme.colors.sereneGreen} />
          </View>
          <Text variant="md" weight="bold" color={theme.colors.readingGraphite}>Vídeo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={() => {}}>
          <View style={[styles.iconCircle, { backgroundColor: '#FADBD8' }]}>
            <Ionicons name="mic" size={32} color={theme.colors.softTerracotta} />
          </View>
          <Text variant="md" weight="bold" color={theme.colors.readingGraphite}>Áudio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={() => {}}>
          <View style={[styles.iconCircle, { backgroundColor: '#E5E7E9' }]}>
            <Ionicons name="document-text" size={32} color={theme.colors.readingGraphite} />
          </View>
          <Text variant="md" weight="bold" color={theme.colors.readingGraphite}>Texto</Text>
        </TouchableOpacity>
      </View>

      {/* Wide Option */}
      <TouchableOpacity style={styles.wideOptionCard} onPress={() => {}}>
        <View style={[styles.iconCircle, { backgroundColor: theme.colors.blueMemory }]}>
          <Ionicons name="musical-notes" size={32} color={theme.colors.whiteSnow} style={{ marginLeft: 4 }} />
        </View>
        <Text variant="md" weight="bold" color={theme.colors.readingGraphite} style={styles.wideOptionText}>Música</Text>
      </TouchableOpacity>

    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    gap: 8,
  },
  dot: {
    width: 16,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7E9', // Light grey
  },
  dotActive: {
    width: 32,
    backgroundColor: theme.colors.blueMemory,
  },
  titlesContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xxl,
  },
  mainTitle: {
    marginBottom: theme.spacing.md,
    lineHeight: 32,
  },
  subtitle: {
    lineHeight: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  optionCard: {
    width: '47%',
    backgroundColor: theme.colors.whiteSnow,
    borderRadius: 24,
    paddingVertical: theme.spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  wideOptionCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.whiteSnow,
    borderRadius: 24,
    padding: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: theme.spacing.xl,
  },
  wideOptionText: {
    marginLeft: theme.spacing.md,
  },
});
