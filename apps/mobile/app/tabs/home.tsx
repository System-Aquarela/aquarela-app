import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { useApp } from '../../src/store/AppContext';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { user, selectedProfile } = useApp();

  return (
    <Screen scrollable contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {/* Mock Avatar */}
          <View style={styles.avatarPlaceholder}>
             <Ionicons name="person" size={24} color={theme.colors.gray400} />
          </View>
        </View>
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory}>
          Oi, {user?.name?.split(' ')[0] || 'Ana'}
        </Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={28} color={theme.colors.blueMemory} />
        </TouchableOpacity>
      </View>

      {/* Próxima Visita Card */}
      <View style={styles.visitCard}>
        <View style={styles.blob} />
        <Text variant="md" weight="bold" color={theme.colors.gray500} style={styles.visitSubtitle}>
          Sua próxima visita
        </Text>
        <View style={styles.visitRow}>
          <View style={styles.calendarIconContainer}>
            <Ionicons name="calendar-outline" size={32} color={theme.colors.whiteSnow} />
          </View>
          <View style={styles.visitInfo}>
            <Text variant="xl" weight="bold" color={theme.colors.blueMemory}>
              Sábado, 15:00
            </Text>
            <Text variant="md" color={theme.colors.gray500}>
              Faltam 2 dias
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.visitButton} onPress={() => router.push('/visits/roadmap')}>
          <Ionicons name="heart-outline" size={20} color={theme.colors.whiteSnow} style={styles.buttonIcon} />
          <Text variant="md" weight="bold" color={theme.colors.whiteSnow}>
            Preparar Visita
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recommended Memory */}
      <Card style={[styles.memoryCard, { padding: 0 }]}>
        <View style={styles.memoryImageContainer}>
          <View style={styles.memoryImageMock} />
          <View style={styles.starIcon}>
             <Ionicons name="star" size={12} color={theme.colors.gray500} />
          </View>
        </View>
        <View style={styles.memoryContent}>
          <Text variant="sm" weight="bold" color={theme.colors.softTerracotta} style={styles.memoryTag}>
            MEMÓRIA RECOMENDADA
          </Text>
          <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.memoryTitle}>
            Viagem para Ubatuba
          </Text>
          <Text variant="md" color={theme.colors.gray500} style={styles.memoryDesc}>
            Essa lembrança sempre traz sorrisos e boas histórias.
          </Text>
        </View>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionSquare, styles.actionAdd]} onPress={() => router.push('/memories/create')}>
          <View style={styles.actionIconAddBg}>
            <Ionicons name="images-outline" size={24} color={theme.colors.readingGraphite} />
          </View>
          <Text variant="md" weight="bold" align="center" color={theme.colors.readingGraphite}>
            Adicionar{'\n'}Memória
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionSquare, styles.actionDiary]} onPress={() => router.push('/tabs/diary')}>
          <View style={styles.actionIconDiaryBg}>
            <Ionicons name="book-outline" size={24} color={theme.colors.whiteSnow} />
          </View>
          <Text variant="md" weight="bold" align="center" color={theme.colors.readingGraphite}>
            Acessar{'\n'}Diário
          </Text>
        </TouchableOpacity>
      </View>

      {/* Última atualização */}
      <Text variant="lg" weight="bold" color={theme.colors.gray500} style={styles.diarySectionTitle}>
        Última atualização no diário
      </Text>
      
      <Card style={styles.diaryCard} padding="md">
        <View style={styles.diaryContent}>
          <View style={styles.diaryHeader}>
            <Text variant="sm" color={theme.colors.gray500}>Hoje, 09:30</Text>
            <View style={styles.diaryTag}>
              <Text variant="sm" color={theme.colors.gray800}>Cuidadores</Text>
            </View>
          </View>
          <Text variant="md" color={theme.colors.readingGraphite} style={styles.diaryText}>
            "Dona Lúcia estava tranquila hoje de manhã. Tomou o café completo e adorou ouvir as músicas da juventude."
          </Text>
        </View>
      </Card>

    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: theme.colors.gray200,
  },
  avatarPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitCard: {
    backgroundColor: theme.colors.whiteSnow,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  blob: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FDE4DE', // Light peach
  },
  visitSubtitle: {
    marginBottom: theme.spacing.md,
  },
  visitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  calendarIconContainer: {
    width: 60,
    height: 60,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.blueMemory,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  visitInfo: {
    flex: 1,
  },
  visitButton: {
    backgroundColor: theme.colors.blueMemory,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: theme.spacing.sm,
  },
  memoryCard: {
    marginBottom: theme.spacing.xl,
    overflow: 'hidden',
  },
  memoryImageContainer: {
    height: 140,
    backgroundColor: '#8EB5D1', // ocean blue mock color
    position: 'relative',
  },
  memoryImageMock: {
    flex: 1,
  },
  starIcon: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: theme.colors.whiteSnow,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memoryContent: {
    padding: theme.spacing.lg,
  },
  memoryTag: {
    marginBottom: theme.spacing.xs,
  },
  memoryTitle: {
    marginBottom: theme.spacing.xs,
  },
  memoryDesc: {
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  actionSquare: {
    width: '48%',
    height: 140,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionAdd: {
    backgroundColor: '#FDE4DE', // Light peach
    borderColor: '#FBC4B6',
    borderWidth: 1,
  },
  actionDiary: {
    backgroundColor: '#E8F1EC', // Light green
    borderColor: '#C7DFD3',
    borderWidth: 1,
  },
  actionIconAddBg: {
    backgroundColor: '#FCAE9B',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  actionIconDiaryBg: {
    backgroundColor: '#4B6858', // dark green for icon
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  diarySectionTitle: {
    marginBottom: theme.spacing.md,
  },
  diaryCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.sereneGreen,
    marginBottom: theme.spacing.xl,
  },
  diaryContent: {
    paddingLeft: theme.spacing.sm,
  },
  diaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  diaryTag: {
    backgroundColor: '#EAE6DF',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
    marginLeft: theme.spacing.sm,
  },
  diaryText: {
    lineHeight: 24,
  },
});
