import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Input } from '../../src/components/ui/Input';
import { useApp } from '../../src/store/AppContext';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../src/components/ui/Card';
import { biometricService } from '../../src/services/biometric.service';

export default function LoginScreen() {
  const router = useRouter();
  const { login, restoreSession } = useApp();
  const [email, setEmail] = useState('ana@aquarela.local');
  const [password, setPassword] = useState('aquarela123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState('biometria');

  useEffect(() => {
    Promise.all([biometricService.isEnabled(), biometricService.isAvailable(), biometricService.getLabel()])
      .then(([enabled, available, label]) => {
        setBiometricEnabled(enabled && available);
        setBiometricLabel(label);
      });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.replace('/profiles/select');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const unlocked = await biometricService.authenticate();
      if (!unlocked) throw new Error('Biometria não concluída. Use e-mail e senha.');
      const restored = await restoreSession();
      if (!restored) throw new Error('Faça login com senha uma vez antes de usar biometria.');
      router.replace('/profiles/select');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível desbloquear.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scrollable contentContainerStyle={styles.container}>
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
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {!!error && (
            <Text variant="sm" color={theme.colors.calmError} style={styles.errorText}>
              {error}
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
          <Text variant="lg" weight="bold" color={theme.colors.readingGraphite}>Entrar</Text>
          <Ionicons name="enter-outline" size={24} color={theme.colors.readingGraphite} style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.biometricBtn, !biometricEnabled && styles.disabledBtn]} onPress={handleBiometricLogin} disabled={loading || !biometricEnabled}>
          <Ionicons name="finger-print-outline" size={22} color={theme.colors.blueMemory} style={{ marginRight: 8 }} />
          <Text variant="md" weight="bold" color={theme.colors.blueMemory}>
            Desbloquear com {biometricLabel}
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
    backgroundColor: '#E6F0F9',
    opacity: 0.5,
  },
  blobBottomRight: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#FDE4DE',
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
  errorText: {
    marginTop: theme.spacing.xs,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  biometricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.blueMemory,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  createAccountBtn: {
    alignItems: 'center',
  },
});
