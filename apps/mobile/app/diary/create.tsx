import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useApp } from '../../src/store/AppContext';
import { diaryService } from '../../src/services/diary.service';
import { DiaryEntry, MoodType } from '../../src/types/diary.types';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

const MOODS: MoodType[] = ['Tranquila', 'Alegre', 'Cansada', 'Confusa', 'Agitada', 'Triste'];

export default function CreateDiaryEntryScreen() {
  const router = useRouter();
  const { selectedProfile, user } = useApp();
  
  const [mood, setMood] = useState<MoodType | null>(null);
  const [interaction, setInteraction] = useState('');
  const [orientation, setOrientation] = useState('');
  const [recognition, setRecognition] = useState('');
  const [obs, setObs] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!selectedProfile || !user || !mood || !interaction || !orientation || !recognition) return;
    
    setLoading(true);
    const entry: DiaryEntry = {
      id: Math.random().toString(),
      profileId: selectedProfile.id,
      registeredBy: user.name,
      date: new Date().toISOString(),
      mood,
      interaction,
      orientation,
      recognition,
      observation: obs
    };

    await diaryService.addEntry(entry);
    setLoading(false);
    router.replace('/tabs/diary');
  };

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Ionicons name="close" size={28} color={theme.colors.readingGraphite} onPress={() => router.back()} />
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>
          Novo registro
        </Text>
      </View>

      <Card style={styles.section}>
        <Text variant="md" weight="bold" style={styles.label}>Humor principal do dia</Text>
        <View style={styles.moodGrid}>
          {MOODS.map(m => (
            <TouchableOpacity 
              key={m} 
              style={[styles.moodItem, mood === m && styles.moodItemSelected]}
              onPress={() => setMood(m)}
            >
              <Text variant="sm" weight={mood === m ? "bold" : "regular"} color={mood === m ? theme.colors.whiteSnow : theme.colors.readingGraphite}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card style={styles.section}>
        <Input
          label="Como foi a interação?"
          placeholder="Ex: Boa, conversou bastante"
          value={interaction}
          onChangeText={setInteraction}
        />
        <Input
          label="Como estava a orientação?"
          placeholder="Ex: Orientada em tempo e espaço"
          value={orientation}
          onChangeText={setOrientation}
        />
        <Input
          label="Como foi o reconhecimento?"
          placeholder="Ex: Reconheceu todos da família"
          value={recognition}
          onChangeText={setRecognition}
        />
        <Input
          label="Observação (opcional)"
          placeholder="Mais algum detalhe?"
          value={obs}
          onChangeText={setObs}
          multiline
          numberOfLines={3}
          style={styles.textArea}
        />
      </Card>

      <Button title="Salvar registro" onPress={handleSave} disabled={loading || !mood || !interaction || !orientation || !recognition} style={styles.button} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    marginLeft: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    marginBottom: theme.spacing.md,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  moodItem: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.gray100,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
  },
  moodItemSelected: {
    backgroundColor: theme.colors.blueMemory,
    borderColor: theme.colors.blueMemory,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    marginBottom: theme.spacing.xl,
  },
});
