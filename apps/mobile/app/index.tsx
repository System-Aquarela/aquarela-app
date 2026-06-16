import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '../src/components/ui/Text';
import { useApp } from '../src/store/AppContext';
import { theme } from '../src/design/theme';

export default function SplashScreen() {
  const router = useRouter();
  const { user, selectedProfile, isLoading } = useApp();

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        if (!user) {
          router.replace('/welcome');
        } else if (!selectedProfile) {
          router.replace('/profiles/select');
        } else {
          router.replace('/tabs/home');
        }
      }, 1500); // Simulate splash screen delay
    }
  }, [isLoading, user, selectedProfile]);

  return (
    <View style={styles.container}>
      <Text variant="huge" weight="bold" color={theme.colors.blueMemory}>
        Aquarela
      </Text>
      <ActivityIndicator size="large" color={theme.colors.softTerracotta} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.creamAffection,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginTop: theme.spacing.xl,
  },
});
