import React from 'react';
import { View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ActiveVisitScreen() {
  const router = useRouter();

  return (
    <Screen style={{ backgroundColor: theme.colors.creamAffection, paddingHorizontal: 0, paddingBottom: 0 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={theme.colors.blueMemory} />
        </TouchableOpacity>
        <Text variant="xl" weight="bold" color={theme.colors.readingGraphite} style={styles.headerTitle}>
          Visita em Andamento
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Memory Player Card */}
        <View style={styles.playerCard}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2946&auto=format&fit=crop' }} 
            style={styles.imageBg}
            imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
          >
            <View style={styles.imageOverlay}>
              <View style={styles.textOverlay}>
                <Text variant="xxl" weight="bold" color={theme.colors.blueMemory} style={styles.memoryTitle}>
                  Viagem para Ubatuba
                </Text>
                <Text variant="lg" color={theme.colors.readingGraphite}>
                  Verão de 1998
                </Text>
              </View>
            </View>
          </ImageBackground>

          {/* Reactions */}
          <View style={styles.reactionsContainer}>
            <TouchableOpacity style={styles.reactionBtn} onPress={() => router.push('/visits/summary')}>
              <View style={styles.reactionIconBg}>
                <Ionicons name="happy" size={24} color={theme.colors.blueMemory} />
              </View>
              <Text variant="sm" color={theme.colors.readingGraphite} style={styles.reactionLabel}>Sorriu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reactionBtn} onPress={() => router.push('/visits/summary')}>
              <View style={styles.reactionIconBg}>
                <Ionicons name="chatbubbles" size={24} color={theme.colors.blueMemory} />
              </View>
              <Text variant="sm" color={theme.colors.readingGraphite} style={styles.reactionLabel}>Conversou</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reactionBtn} onPress={() => router.push('/visits/summary')}>
              <View style={styles.reactionIconBg}>
                <Ionicons name="leaf" size={24} color={theme.colors.blueMemory} />
              </View>
              <Text variant="sm" color={theme.colors.readingGraphite} style={styles.reactionLabel}>Calma</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Media Controls Footer */}
      <View style={styles.mediaFooter}>
        <TouchableOpacity style={styles.mediaSideBtn}>
          <Ionicons name="chevron-back" size={28} color={theme.colors.readingGraphite} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.mediaPlayBtn}>
          <Ionicons name="play" size={32} color={theme.colors.whiteSnow} style={{ marginLeft: 4 }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.mediaSideBtn}>
          <Ionicons name="chevron-forward" size={28} color={theme.colors.readingGraphite} />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
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
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  playerCard: {
    backgroundColor: theme.colors.whiteSnow,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  imageBg: {
    width: '100%',
    height: 320,
    justifyContent: 'flex-end',
  },
  imageOverlay: {
    padding: theme.spacing.md,
  },
  textOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: theme.spacing.md,
    borderRadius: 12,
  },
  memoryTitle: {
    marginBottom: 4,
  },
  reactionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.lg,
  },
  reactionBtn: {
    alignItems: 'center',
  },
  reactionIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5EFE6', // Light beige
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  reactionLabel: {
    marginTop: 4,
  },
  mediaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    backgroundColor: theme.colors.creamAffection,
    gap: theme.spacing.xl,
  },
  mediaSideBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5EFE6', // Light beige
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaPlayBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
