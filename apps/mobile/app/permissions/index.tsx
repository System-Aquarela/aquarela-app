import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { theme } from '../../src/design/theme';
import { useApp } from '../../src/store/AppContext';
import { FamilyMember, MemberRole, membersService } from '../../src/services/members.service';

const roles: Array<{ value: MemberRole; label: string }> = [
  { value: 'caregiver', label: 'Cuidador' },
  { value: 'family', label: 'Familiar' },
  { value: 'viewer', label: 'Leitura' },
];

const roleLabels: Record<MemberRole, string> = {
  owner: 'Administrador', caregiver: 'Cuidador', family: 'Familiar', viewer: 'Somente leitura',
};

export default function PermissionsScreen() {
  const router = useRouter();
  const { selectedProfile, user } = useApp();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<MemberRole>('family');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    if (!selectedProfile) return;
    try {
      setMembers(await membersService.list(selectedProfile.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar os acessos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [selectedProfile?.id]);

  async function invite() {
    if (!selectedProfile || !email.trim()) return;
    setSaving(true);
    setError('');
    try {
      await membersService.invite(selectedProfile.id, email.trim().toLowerCase(), role);
      setEmail('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível conceder o acesso.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(member: FamilyMember) {
    if (!selectedProfile || member.user.id === user?.id) return;
    setSaving(true);
    try {
      await membersService.remove(selectedProfile.id, member.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível remover o acesso.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scrollable contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} onPress={() => router.back()} />
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>Família e permissões</Text>
      </View>
      <Text variant="md" color={theme.colors.gray500} style={styles.description}>
        Cada pessoa precisa ter uma conta. O acesso é aplicado somente ao perfil de {selectedProfile?.name}.
      </Text>

      {loading ? <ActivityIndicator color={theme.colors.blueMemory} /> : members.map(member => (
        <Card key={member.id} style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.avatar, member.role === 'owner' && styles.ownerAvatar]}>
              <Text variant="md" weight="bold" color={theme.colors.whiteSnow}>{member.user.name.slice(0, 1).toUpperCase()}</Text>
            </View>
            <View style={styles.info}>
              <Text variant="md" weight="bold">{member.user.name}{member.user.id === user?.id ? ' (você)' : ''}</Text>
              <Text variant="sm" color={theme.colors.gray500}>{member.user.email}</Text>
              <Text variant="xs" weight="bold" color={theme.colors.blueMemory} style={styles.roleLabel}>{roleLabels[member.role]}</Text>
            </View>
            {member.role !== 'owner' && member.user.id !== user?.id && (
              <TouchableOpacity onPress={() => remove(member)} accessibilityLabel={`Remover acesso de ${member.user.name}`} disabled={saving}>
                <Ionicons name="trash-outline" size={22} color={theme.colors.calmError} />
              </TouchableOpacity>
            )}
          </View>
        </Card>
      ))}

      <Card style={styles.inviteCard} padding="lg">
        <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.inviteTitle}>Conceder acesso</Text>
        <Input label="E-mail da conta" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="pessoa@exemplo.com" />
        <View style={styles.roles}>
          {roles.map(item => (
            <TouchableOpacity key={item.value} style={[styles.roleChip, role === item.value && styles.roleChipActive]} onPress={() => setRole(item.value)}>
              <Text variant="sm" weight="bold" color={role === item.value ? theme.colors.whiteSnow : theme.colors.readingGraphite}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {!!error && <Text variant="sm" color={theme.colors.calmError} style={styles.error}>{error}</Text>}
        <Button title={saving ? 'Salvando...' : 'Conceder acesso'} onPress={invite} disabled={saving || !email.trim()} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 48 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md },
  title: { marginLeft: theme.spacing.md, flex: 1 },
  description: { marginBottom: theme.spacing.xl, lineHeight: 22 },
  card: { marginBottom: theme.spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.sereneGreen, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md },
  ownerAvatar: { backgroundColor: theme.colors.blueMemory },
  info: { flex: 1 },
  roleLabel: { marginTop: 3 },
  inviteCard: { marginTop: theme.spacing.lg },
  inviteTitle: { marginBottom: theme.spacing.md },
  roles: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.lg },
  roleChip: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md, borderRadius: theme.radius.round, backgroundColor: theme.colors.gray100 },
  roleChipActive: { backgroundColor: theme.colors.blueMemory },
  error: { marginBottom: theme.spacing.md },
});
