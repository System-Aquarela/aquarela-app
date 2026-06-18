import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { useApp } from '../../src/store/AppContext';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const { selectedProfile, logout } = useApp();

  if (!selectedProfile) return null;

  return (
    <Screen scrollable contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarSmallContainer}>
          {selectedProfile.photoUrl ? <Image source={{ uri: selectedProfile.photoUrl }} style={styles.avatarSmall} /> : <Ionicons name="person" size={22} color={theme.colors.whiteSnow} />}
        </View>
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory}>
          Aquarela
        </Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.blueMemory} />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <Card style={styles.profileCard} padding="xl">
        <View style={styles.mainAvatarContainer}>
          {selectedProfile.photoUrl ? <Image source={{ uri: selectedProfile.photoUrl }} style={styles.mainAvatar} /> : <Ionicons name="person" size={48} color={theme.colors.whiteSnow} />}
        </View>
        
        <Text variant="xxl" weight="bold" color={theme.colors.blueMemory} align="center" style={styles.name}>
          {selectedProfile.name}
        </Text>
        <Text variant="lg" color={theme.colors.gray500} align="center" style={styles.nickname}>
          "{selectedProfile.nickname}"
        </Text>

        <View style={styles.badgesRow}>
          <View style={styles.badge}>
            <Ionicons name="person-outline" size={16} color={theme.colors.readingGraphite} style={styles.badgeIcon} />
            <Text variant="sm" weight="medium" color={theme.colors.readingGraphite}>{selectedProfile.age} anos</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="home-outline" size={16} color={theme.colors.readingGraphite} style={styles.badgeIcon} />
            <Text variant="sm" weight="medium" color={theme.colors.readingGraphite}>{selectedProfile.city || 'Cidade não informada'}</Text>
          </View>
        </View>

        <Button 
          title="Editar Perfil" 
          icon={<Ionicons name="pencil-outline" size={18} color={theme.colors.whiteSnow} style={{ marginRight: 8 }} />}
          onPress={() => router.push('/profiles/manage?mode=edit')} 
          style={styles.editButton}
        />
      </Card>

      {/* Assuntos favoritos */}
      <Card style={styles.sectionCard} padding="lg">
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: '#D4E6F1' }]}>
            <Ionicons name="heart" size={20} color={theme.colors.blueMemory} />
          </View>
          <Text variant="lg" weight="bold" color={theme.colors.blueMemory}>
            Assuntos favoritos
          </Text>
        </View>
        <View style={styles.tagsContainer}>
          {selectedProfile.favoriteSubjects.map((item, index) => (
            <View key={index} style={styles.tag}>
              <Text variant="sm" color={theme.colors.readingGraphite}>{item}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Músicas favoritas */}
      <Card style={styles.sectionCard} padding="lg">
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: '#D5F5E3' }]}>
            <Ionicons name="musical-note" size={20} color={theme.colors.sereneGreen} />
          </View>
          <Text variant="lg" weight="bold" color={theme.colors.sereneGreen}>
            Músicas favoritas
          </Text>
        </View>
        <View style={styles.songsList}>
          {selectedProfile.favoriteSongs.map((item, index) => (
            <View key={index} style={styles.songCard}>
              <Ionicons name="play-circle-outline" size={24} color={theme.colors.sereneGreen} style={styles.songIcon} />
              <View>
                <Text variant="md" weight="bold" color={theme.colors.readingGraphite}>{item.split('-')[0]}</Text>
                <Text variant="sm" color={theme.colors.gray500}>{item.split('-')[1] || 'Música'}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* Temas Sensíveis */}
      <Card style={styles.sectionDangerCard} padding="lg">
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: '#FADBD8' }]}>
            <Ionicons name="warning" size={20} color={theme.colors.calmError} />
          </View>
          <Text variant="lg" weight="bold" color={theme.colors.softTerracotta}>
            Temas Sensíveis
          </Text>
        </View>
        <Text variant="md" color={theme.colors.gray500} style={styles.dangerSubtitle}>
          Evitar mencionar durante as conversas
        </Text>
        <View style={styles.dangerList}>
          {selectedProfile.sensitiveTopics.map((item, index) => (
            <View key={index} style={styles.dangerItem}>
              <Ionicons name="ban-outline" size={20} color={theme.colors.calmError} style={styles.dangerIcon} />
              <Text variant="md" color={theme.colors.readingGraphite} style={{ flex: 1 }}>{item}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.sectionCard} padding="sm">
        <ProfileOption title="Pessoas importantes" icon="people-outline" onPress={() => router.push('/people/index')} />
        <ProfileOption title="Família e permissões" icon="key-outline" onPress={() => router.push('/permissions/index')} />
        <ProfileOption title="Privacidade e segurança" icon="lock-closed-outline" onPress={() => router.push('/settings/privacy')} />
        <ProfileOption title="Plano Premium" icon="star-outline" onPress={() => router.push('/premium')} />
      </Card>

      <View style={styles.actions}>
        <Button 
          title="Sair" 
          variant="outline" 
          onPress={async () => {
            await logout();
            router.replace('/welcome');
          }} 
        />
      </View>
    </Screen>
  );
}

function ProfileOption({ title, icon, onPress }: { title: string; icon: any; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.profileOption} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.optionLeft}>
        <Ionicons name={icon} size={22} color={theme.colors.blueMemory} />
        <Text variant="md" weight="medium" color={theme.colors.readingGraphite} style={styles.optionText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.gray400} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatarSmallContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: theme.colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSmall: {
    width: '100%',
    height: '100%',
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  mainAvatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: theme.colors.gray200,
    marginBottom: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainAvatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginBottom: 4,
  },
  nickname: {
    marginBottom: theme.spacing.lg,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EFE6', // Light beige
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 16,
  },
  badgeIcon: {
    marginRight: 6,
  },
  editButton: {
    width: '100%',
    borderRadius: 24,
  },
  sectionCard: {
    marginBottom: theme.spacing.lg,
  },
  sectionDangerCard: {
    marginBottom: theme.spacing.lg,
    borderTopWidth: 4,
    borderColor: '#FCAE9B', // light red border at top
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tag: {
    backgroundColor: '#F5EFE6',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
  },
  songsList: {
    gap: theme.spacing.md,
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EFE6',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  songIcon: {
    marginRight: theme.spacing.md,
  },
  dangerSubtitle: {
    marginBottom: theme.spacing.md,
  },
  dangerList: {
    gap: theme.spacing.sm,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE8E8', // Light red
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  dangerIcon: {
    marginRight: theme.spacing.md,
  },
  actions: {
    marginTop: theme.spacing.md,
  },
  profileOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
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
