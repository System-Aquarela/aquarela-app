import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { useApp } from '../../src/store/AppContext';
import { profilesService } from '../../src/services/profiles.service';
import { Profile } from '../../src/types/profile.types';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SelectProfileScreen() {
  const router = useRouter();
  const { selectProfile } = useApp();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    const data = await profilesService.getProfiles();
    setProfiles(data);
    setLoading(false);
  }

  async function handleSelect(profile: Profile) {
    await selectProfile(profile);
    router.replace('/tabs/home');
  }

  if (loading) {
    return (
      <Screen style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.blueMemory} />
      </Screen>
    );
  }

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Text variant="xxl" weight="bold" color={theme.colors.blueMemory}>
          Quem você vai acompanhar hoje?
        </Text>
        <Text variant="md" color={theme.colors.gray500} style={styles.subtitle}>
          Escolha o perfil para carregar memórias, diário, visitas e vínculos locais.
        </Text>
      </View>

      <View style={styles.list}>
        {profiles.map(profile => (
          <TouchableOpacity key={profile.id} onPress={() => handleSelect(profile)} activeOpacity={0.8}>
            <Card style={styles.card}>
              {profile.photoUrl ? <Image source={{ uri: profile.photoUrl }} style={styles.avatarImage} /> : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={32} color={theme.colors.whiteSnow} />
                </View>
              )}
              <View style={styles.cardInfo}>
                <Text variant="lg" weight="semibold">{profile.name}</Text>
                <Text variant="sm" color={theme.colors.gray500}>{profile.age} anos • acompanhamento familiar</Text>
                <Text variant="xs" color={theme.colors.gray500} style={styles.updatedText}>Dados privados sincronizados com o ambiente local</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.gray400} />
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addProfileCard} activeOpacity={0.75} onPress={() => router.push('/profiles/manage?mode=create')}>
        <Ionicons name="add-circle-outline" size={24} color={theme.colors.blueMemory} />
        <Text variant="md" weight="bold" color={theme.colors.blueMemory} style={styles.addProfileText}>
          Adicionar pessoa acompanhada
        </Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  subtitle: {
    marginTop: theme.spacing.sm,
    lineHeight: 22,
  },
  list: {
    gap: theme.spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.sereneGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  updatedText: {
    marginTop: theme.spacing.xs,
  },
  addProfileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.blueMemory,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  addProfileText: {
    marginLeft: theme.spacing.sm,
  },
});
