import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
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

  const loadProfiles = async () => {
    const data = await profilesService.getProfiles();
    setProfiles(data);
    setLoading(false);
  };

  const handleSelect = async (profile: Profile) => {
    await selectProfile(profile);
    router.replace('/tabs/home');
  };

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
      </View>

      <View style={styles.list}>
        {profiles.map(profile => (
          <TouchableOpacity key={profile.id} onPress={() => handleSelect(profile)} activeOpacity={0.8}>
            <Card style={styles.card}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={32} color={theme.colors.whiteSnow} />
              </View>
              <View style={styles.cardInfo}>
                <Text variant="lg" weight="semibold">{profile.name}</Text>
                <Text variant="sm" color={theme.colors.gray500}>{profile.age} anos</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.gray400} />
            </Card>
          </TouchableOpacity>
        ))}
      </View>
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
  cardInfo: {
    flex: 1,
  },
});
