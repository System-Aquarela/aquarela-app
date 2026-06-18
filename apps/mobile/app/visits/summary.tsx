import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useApp } from '../../src/store/AppContext';
import { visitsService } from '../../src/services/visits.service';
import { VisitRecord } from '../../src/types/visit.types';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function VisitSummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ smile?: string; conversation?: string; discomfort?: string }>();
  const { selectedProfile, user } = useApp();
  
  const [smile, setSmile] = useState(params.smile === 'true');
  const [conversation, setConversation] = useState(params.conversation === 'true');
  const [discomfort, setDiscomfort] = useState(params.discomfort === 'true');
  const [obs, setObs] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!selectedProfile || !user) return;
    
    setLoading(true);
    setError('');
    try {
      const visit: VisitRecord = {
        id: Math.random().toString(),
        profileId: selectedProfile.id,
        visitorId: user.id,
        date: new Date().toISOString(),
        generatedSmile: smile,
        generatedConversation: conversation,
        generatedDiscomfort: discomfort,
        observation: obs.trim(),
      };
      await visitsService.addVisit(visit);
      router.replace('/tabs/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a visita.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Text variant="xxl" weight="bold" color={theme.colors.blueMemory}>
          Como foi a visita?
        </Text>
        <Text variant="md" color={theme.colors.gray500}>
          Registre rapidamente suas observações.
        </Text>
      </View>

      <Card style={styles.section}>
        <Text variant="lg" weight="bold" style={styles.sectionTitle}>
          Durante a visita...
        </Text>
        
        <ToggleRow 
          label="Gerou sorriso?" 
          value={smile} 
          onToggle={() => setSmile(!smile)} 
          icon="happy" 
          color={theme.colors.sereneGreen}
        />
        <ToggleRow 
          label="Gerou conversa?" 
          value={conversation} 
          onToggle={() => setConversation(!conversation)} 
          icon="chatbubbles" 
          color={theme.colors.blueMemory}
        />
        <ToggleRow 
          label="Houve desconforto?" 
          value={discomfort} 
          onToggle={() => setDiscomfort(!discomfort)} 
          icon="warning" 
          color={theme.colors.calmError}
        />
      </Card>

      <Card style={styles.section}>
        <Input
          label="Observação (opcional)"
          placeholder="Algo a destacar?"
          value={obs}
          onChangeText={setObs}
          multiline
          numberOfLines={3}
          style={styles.textArea}
        />
      </Card>

      {!!error && <Text variant="sm" color={theme.colors.calmError} style={styles.error}>{error}</Text>}
      <Button title={loading ? 'Salvando...' : 'Salvar registro'} onPress={handleSave} disabled={loading} style={styles.button} />
      <Button title="Pular" variant="outline" onPress={() => router.replace('/tabs/home')} />
    </Screen>
  );
}

function ToggleRow({ label, value, onToggle, icon, color }: { label: string, value: boolean, onToggle: () => void, icon: any, color: string }) {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8} style={styles.toggleRow}>
      <View style={styles.toggleLabel}>
        <Ionicons name={icon} size={24} color={color} />
        <Text variant="md" weight="semibold" style={styles.toggleText}>{label}</Text>
      </View>
      <Ionicons 
        name={value ? "checkbox" : "square-outline"} 
        size={28} 
        color={value ? theme.colors.blueMemory : theme.colors.gray300} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  toggleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    marginLeft: theme.spacing.md,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginBottom: theme.spacing.md,
  },
  error: { marginBottom: theme.spacing.md },
});
