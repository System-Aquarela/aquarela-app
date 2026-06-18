import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/ui/Screen';
import { Text } from '../src/components/ui/Text';
import { Button } from '../src/components/ui/Button';
import { theme } from '../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

const aquarelaLogo = require('../../../info/AquarelaLogo.jpeg');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <Screen style={styles.container}>
      {/* Background Blobs */}
      <View style={styles.blobTopLeft} />
      <View style={styles.blobBottomRight} />

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image source={aquarelaLogo} style={styles.avatar} />
        </View>

        <Text variant="xxl" weight="bold" color={theme.colors.blueMemory} align="center">
          Aquarela
        </Text>
        <Text variant="md" color={theme.colors.readingGraphite} align="center" style={styles.subtitle}>
          Memórias que aproximam famílias. Guarde histórias, prepare visitas e fortaleça vínculos com quem você ama.
        </Text>
        <Text variant="sm" weight="bold" color={theme.colors.softTerracotta} align="center" style={styles.tagline}>
          Transformando lembranças em conexões
        </Text>
      </View>
      
      <View style={styles.actions}>
        <Button 
          title="Entrar" 
          onPress={() => router.push('/auth/login')} 
          style={styles.button}
        />
        <Button 
          title="Criar conta" 
          variant="outline" 
          onPress={() => router.push('/auth/register')} 
          style={styles.button}
        />
        
        <TouchableOpacity style={styles.inviteBtn} onPress={() => router.push('/auth/login')}>
          <Ionicons name="mail-outline" size={20} color={theme.colors.softTerracotta} style={{ marginRight: 8 }} />
          <Text variant="md" weight="bold" color={theme.colors.softTerracotta} style={{ textDecorationLine: 'underline' }}>
            Recebi um convite
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  blobTopLeft: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#E6F0F9', // Light blue
    opacity: 0.6,
  },
  blobBottomRight: {
    position: 'absolute',
    bottom: 50,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#FDE4DE', // Peach
    opacity: 0.4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  avatarContainer: {
    width: 200,
    height: 200,
    borderRadius: 44,
    backgroundColor: theme.colors.whiteSnow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    borderWidth: 4,
    borderColor: theme.colors.whiteSnow,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  subtitle: {
    marginTop: theme.spacing.lg,
    lineHeight: 24,
    paddingHorizontal: theme.spacing.md,
  },
  tagline: { marginTop: theme.spacing.md },
  actions: {
    paddingBottom: theme.spacing.xl,
  },
  button: {
    marginBottom: theme.spacing.md,
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
  },
});
