import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Input } from '../../src/components/ui/Input';
import { useApp } from '../../src/store/AppContext';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../src/components/ui/Card';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email) return;
    setLoading(true);
    await login(email);
    setLoading(false);
    router.replace('/profiles/select');
  };

  return (
    <Screen scrollable contentContainerStyle={styles.container}>
      {/* Background Blobs */}
      <View style={styles.blobTopLeft} />
      <View style={styles.blobBottomRight} />

      <Card style={styles.card} padding="xl">
        <View style={styles.header}>
          <Text variant="xxl" weight="bold" color={theme.colors.blueMemory} align="center">
            Aquarela
          </Text>
          <Text variant="md" color={theme.colors.readingGraphite} align="center" style={styles.subtitle}>
            Bem-vindo de volta ao seu{'\n'}espaço de memórias.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="E-mail"
            placeholder=""
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Senha"
            placeholder=""
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.forgotPassword}>
            <Text variant="sm" weight="bold" color={theme.colors.blueMemory} align="right">
              Esqueci minha senha
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
          <Text variant="lg" weight="bold" color={theme.colors.readingGraphite}>Entrar</Text>
          <Ionicons name="enter-outline" size={24} color={theme.colors.readingGraphite} style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text variant="sm" color={theme.colors.gray500} style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.inviteBtn}>
          <Ionicons name="mail-outline" size={20} color={theme.colors.softTerracotta} style={{ marginRight: 8 }} />
          <Text variant="md" weight="bold" color={theme.colors.softTerracotta}>
            Entrar com Convite
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.createAccountBtn} onPress={() => router.push('/auth/register')}>
          <Text variant="md" weight="bold" color={theme.colors.blueMemory} align="center">
            Criar nova conta
          </Text>
        </TouchableOpacity>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  blobTopLeft: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E6F0F9', // Light blue
    opacity: 0.5,
  },
  blobBottomRight: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#FDE4DE', // Peach
    opacity: 0.5,
  },
  card: {
    backgroundColor: theme.colors.whiteSnow,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  subtitle: {
    marginTop: theme.spacing.sm,
    lineHeight: 22,
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  forgotPassword: {
    marginTop: theme.spacing.sm,
    alignSelf: 'flex-end',
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.gray200,
  },
  dividerText: {
    paddingHorizontal: theme.spacing.md,
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xxl,
  },
  createAccountBtn: {
    alignItems: 'center',
  },
});
