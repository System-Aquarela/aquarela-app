import React, { useEffect, useState } from 'react';
import { Alert, Share, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { theme } from '../../src/design/theme';
import { biometricService } from '../../src/services/biometric.service';
import { apiClient } from '../../src/services/api.service';
import { useApp } from '../../src/store/AppContext';

interface ConsentRecord {
  id: string;
  scope: string;
  granted: boolean;
  recordedAt: string;
  person?: { name: string };
  user?: { name: string };
}

export default function PrivacyScreen() {
  const router = useRouter();
  const { selectedProfile } = useApp();
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState('biometria');
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([biometricService.isAvailable(), biometricService.isEnabled(), biometricService.getLabel()])
      .then(([available, enabled, label]) => {
        setBiometricAvailable(available);
        setBiometricEnabled(enabled && available);
        setBiometricLabel(label);
      });
    if (selectedProfile) {
      apiClient.get<{ consents: ConsentRecord[] }>(`/profiles/${selectedProfile.id}/consents`)
        .then(response => setConsents(response.consents))
        .catch(() => setConsents([]));
    }
  }, [selectedProfile?.id]);

  async function toggleBiometric(enabled: boolean) {
    setSaving(true);
    try {
      await biometricService.setEnabled(enabled);
      setBiometricEnabled(enabled);
    } catch (error) {
      Alert.alert('Biometria', error instanceof Error ? error.message : 'Não foi possível alterar esta opção.');
    } finally {
      setSaving(false);
    }
  }

  async function exportData() {
    if (!selectedProfile) return;
    setSaving(true);
    try {
      const data = await apiClient.get(`/profiles/${selectedProfile.id}/export`);
      await Share.share({
        title: `Dados de ${selectedProfile.name} - Aquarela`,
        message: JSON.stringify(data, null, 2),
      });
    } catch (error) {
      Alert.alert('Exportação', error instanceof Error ? error.message : 'Não foi possível exportar os dados.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scrollable contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Voltar">
          <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} />
        </TouchableOpacity>
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>Segurança e privacidade</Text>
      </View>

      <Card style={styles.section} padding="lg">
        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text variant="lg" weight="bold" color={theme.colors.blueMemory}>Entrada com {biometricLabel}</Text>
            <Text variant="sm" color={theme.colors.gray500} style={styles.settingDescription}>
              Desbloqueia uma sessão já autenticada. E-mail e senha continuam disponíveis.
            </Text>
          </View>
          <Switch
            value={biometricEnabled}
            onValueChange={toggleBiometric}
            disabled={!biometricAvailable || saving}
            trackColor={{ false: theme.colors.gray300, true: theme.colors.sereneGreen }}
          />
        </View>
        {!biometricAvailable && <Text variant="xs" color={theme.colors.attention}>Cadastre uma biometria forte nas configurações do aparelho para habilitar.</Text>}
      </Card>

      <Card style={styles.section} padding="lg">
        <View style={styles.iconTitle}>
          <Ionicons name="shield-checkmark-outline" size={24} color={theme.colors.sereneGreen} />
          <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.iconTitleText}>Dados da família</Text>
        </View>
        <Text variant="md" style={styles.paragraph}>
          Memórias, diário, relatórios e fotos ficam no ambiente privado da família. Arquivos são entregues por links temporários e não ficam públicos no armazenamento.
        </Text>
        <Button title="Exportar dados deste perfil" variant="outline" onPress={exportData} disabled={saving || !selectedProfile} />
      </Card>

      <Card style={styles.section} padding="lg">
        <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.sectionTitle}>Histórico de consentimento facial</Text>
        {consents.length === 0 ? (
          <Text variant="sm" color={theme.colors.gray500}>Nenhum consentimento facial registrado.</Text>
        ) : consents.slice(0, 6).map(item => (
          <View key={item.id} style={styles.consentRow}>
            <Ionicons name={item.granted ? 'checkmark-circle' : 'close-circle'} size={20} color={item.granted ? theme.colors.sereneGreen : theme.colors.calmError} />
            <View style={styles.consentText}>
              <Text variant="sm" weight="bold">{item.person?.name || 'Pessoa cadastrada'}: {item.granted ? 'autorizado' : 'revogado'}</Text>
              <Text variant="xs" color={theme.colors.gray500}>{new Date(item.recordedAt).toLocaleString('pt-BR')} por {item.user?.name || 'familiar'}</Text>
            </View>
          </View>
        ))}
      </Card>

      <Card style={styles.notice} padding="lg">
        <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.sectionTitle}>Importante</Text>
        <Text variant="md" style={styles.paragraph}>
          O Aquarela não faz diagnósticos médicos. Scanner, índice e insights apoiam conversas e organização familiar; nunca substituem avaliação profissional.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 48 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xl },
  title: { marginLeft: theme.spacing.md, flex: 1 },
  section: { marginBottom: theme.spacing.md },
  notice: { marginBottom: theme.spacing.md, borderLeftWidth: 4, borderLeftColor: theme.colors.attention },
  sectionTitle: { marginBottom: theme.spacing.md },
  paragraph: { marginBottom: theme.spacing.md, lineHeight: 23 },
  settingRow: { flexDirection: 'row', alignItems: 'center' },
  settingText: { flex: 1, marginRight: theme.spacing.md },
  settingDescription: { marginTop: theme.spacing.xs, lineHeight: 20 },
  iconTitle: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md },
  iconTitleText: { marginLeft: theme.spacing.sm },
  consentRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderBottomColor: theme.colors.gray100 },
  consentText: { marginLeft: theme.spacing.sm, flex: 1 },
});
