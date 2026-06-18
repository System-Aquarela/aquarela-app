import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useApp } from '../../src/store/AppContext';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleRegister = async () => {
    if (!email || !name || !password) return;
    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }
    if (password.length < 8) {
      setError('Use pelo menos 8 caracteres na senha.');
      return;
    }
    if (!termsAccepted) {
      setError('Leia e aceite os termos de uso e privacidade.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      router.replace('/profiles/select');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar a conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Text variant="xxl" weight="bold" color={theme.colors.blueMemory}>
          Criar conta
        </Text>
        <Text variant="md" color={theme.colors.gray500}>
          Junte-se a nós para registrar e celebrar suas memórias mais queridas.
        </Text>
      </View>

      <View style={styles.form}>
        <Input label="Nome completo" placeholder="Digite seu nome" value={name} onChangeText={setName} />
        <Input label="E-mail" placeholder="Digite seu e-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Input label="Senha" placeholder="Mínimo de 8 caracteres" value={password} onChangeText={setPassword} secureTextEntry />
        <Input label="Confirmar senha" placeholder="Digite a senha novamente" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        <TouchableOpacity style={styles.termsRow} onPress={() => setTermsAccepted(value => !value)} accessibilityRole="checkbox" accessibilityState={{ checked: termsAccepted }}>
          <Ionicons name={termsAccepted ? 'checkbox' : 'square-outline'} size={26} color={termsAccepted ? theme.colors.sereneGreen : theme.colors.gray400} />
          <Text variant="sm" color={theme.colors.readingGraphite} style={styles.termsText}>
            Li e aceito os termos de uso, a política de privacidade e o tratamento dos dados necessários ao aplicativo.
          </Text>
        </TouchableOpacity>
        {!!error && <Text variant="sm" color={theme.colors.calmError}>{error}</Text>}
      </View>

      <View style={styles.actions}>
        <Button title="Criar conta" onPress={handleRegister} disabled={loading || !name || !email || !password || !confirmPassword || !termsAccepted} />
        <Button title="Voltar" variant="outline" onPress={() => router.back()} style={styles.backButton} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  actions: {
    marginTop: 'auto',
  },
  backButton: {
    marginTop: theme.spacing.md,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: theme.spacing.xs,
  },
  termsText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    lineHeight: 20,
  },
});
