import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useApp } from '../../src/store/AppContext';
import { legacyService } from '../../src/services/legacy.service';
import { LegacyAnswerType, LegacyEntry } from '../../src/types/legacy.types';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

const questions = [
  'Qual conselho você gostaria de deixar para a família?',
  'Qual história sempre te faz sorrir?',
  'Qual conquista te deixa mais feliz?',
];

export default function LegacyScreen() {
  const router = useRouter();
  const { selectedProfile } = useApp();
  const [entries, setEntries] = useState<LegacyEntry[]>([]);
  const [question, setQuestion] = useState(questions[0]);
  const [type, setType] = useState<LegacyAnswerType>('texto');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    legacyService.getEntries().then(setEntries);
  }, []);

  async function handleSave() {
    if (!selectedProfile || !answer) return;
    const entry: LegacyEntry = {
      id: `leg-${Date.now()}`,
      profileId: selectedProfile.id,
      question,
      answer,
      type,
      date: new Date().toISOString(),
    };
    await legacyService.addEntry(entry);
    setEntries([entry, ...entries]);
    setAnswer('');
  }

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} onPress={() => router.back()} />
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>Mural de legados</Text>
      </View>

      <Card style={styles.formCard} padding="lg">
        <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.cardTitle}>Pergunta guiada</Text>
        <View style={styles.questionList}>
          {questions.map(item => (
            <TouchableOpacity key={item} style={[styles.questionChip, question === item && styles.questionActive]} onPress={() => setQuestion(item)}>
              <Text variant="sm" weight="bold" color={question === item ? theme.colors.whiteSnow : theme.colors.readingGraphite}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.typeRow}>
          {(['texto', 'audio', 'video'] as LegacyAnswerType[]).map(item => (
            <TouchableOpacity key={item} style={[styles.typeChip, type === item && styles.typeActive]} onPress={() => setType(item)}>
              <Ionicons name={item === 'texto' ? 'reader-outline' : item === 'audio' ? 'mic-outline' : 'videocam-outline'} size={18} color={type === item ? theme.colors.whiteSnow : theme.colors.blueMemory} />
              <Text variant="sm" weight="bold" color={type === item ? theme.colors.whiteSnow : theme.colors.readingGraphite} style={styles.typeText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Input label="Resposta" placeholder="Registre a resposta em texto" value={answer} onChangeText={setAnswer} multiline numberOfLines={4} style={styles.textArea} />
        <Button title="Salvar legado" onPress={handleSave} disabled={!answer} />
      </Card>

      {entries.map(entry => (
        <Card key={entry.id} style={styles.entryCard} padding="lg">
          <Text variant="sm" weight="bold" color={theme.colors.softTerracotta}>{entry.type.toUpperCase()}</Text>
          <Text variant="md" weight="bold" color={theme.colors.blueMemory} style={styles.cardTitle}>{entry.question}</Text>
          <Text variant="md" color={theme.colors.readingGraphite} style={styles.answer}>{entry.answer}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xl },
  title: { marginLeft: theme.spacing.md },
  formCard: { marginBottom: theme.spacing.lg },
  cardTitle: { marginBottom: theme.spacing.sm },
  questionList: { gap: theme.spacing.sm, marginBottom: theme.spacing.md },
  questionChip: { padding: theme.spacing.md, borderRadius: theme.radius.md, backgroundColor: theme.colors.gray100 },
  questionActive: { backgroundColor: theme.colors.blueMemory },
  typeRow: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.md },
  typeChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderRadius: theme.radius.round, backgroundColor: theme.colors.gray100 },
  typeActive: { backgroundColor: theme.colors.blueMemory },
  typeText: { marginLeft: theme.spacing.xs },
  textArea: { minHeight: 110, textAlignVertical: 'top' },
  entryCard: { marginBottom: theme.spacing.md },
  answer: { lineHeight: 22 },
});
