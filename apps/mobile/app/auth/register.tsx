import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useApp } from '../../src/store/AppContext';
import { theme } from '../../src/design/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !name) return;
    setLoading(true);
    await login(email); // Simulating account creation + login
    setLoading(false);
    router.replace('/profiles/select');
  };

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Text variant="xxl" weight="bold" color={theme.colors.blueMemory}>
          Criar conta
        </Text>
        <Text variant="md" color={theme.colors.gray500}>
          Preencha seus dados para começar
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Nome completo"
          placeholder="Digite seu nome"
          value={name}
          onChangeText={setName}
        />
        <Input
          label="E-mail"
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Senha"
          placeholder="Crie uma senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.actions}>
        <Button title="Criar conta" onPress={handleRegister} disabled={loading} />
        <Button 
          title="Voltar" 
          variant="outline" 
          onPress={() => router.back()} 
          style={styles.backButton}
        />
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
});
