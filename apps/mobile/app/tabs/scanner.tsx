import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';
import { peopleService } from '../../src/services/people.service';
import { memoriesService } from '../../src/services/memories.service';
import { scannerService } from '../../src/services/scanner.service';
import { Person } from '../../src/types/person.types';
import { Memory } from '../../src/types/memory.types';

export default function ScannerScreen() {
  const router = useRouter();
  const [people, setPeople] = useState<Person[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [detected, setDetected] = useState<Person | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [recognizing, setRecognizing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [peopleData, memoriesData] = await Promise.all([
      peopleService.getPeople(),
      memoriesService.getMemories(),
    ]);
    setPeople(peopleData);
    setMemories(memoriesData);
    setDetected(null);
  }

  async function handleRecognize() {
    if (!permission?.granted) {
      await requestPermission();
      return;
    }
    const picture = await cameraRef.current?.takePictureAsync?.({ quality: 0.75 });
    if (!picture?.uri) return;
    setRecognizing(true);
    setError('');
    try {
      const matches = await scannerService.recognize(picture.uri);
      if (matches[0]?.person) {
        setDetected(matches[0].person);
        setScore(matches[0].score);
      } else {
        setDetected(null);
        setScore(null);
        setError('Nenhuma correspondência segura foi encontrada. Selecione a pessoa manualmente, se desejar.');
      }
    } catch (err) {
      setDetected(null);
      setScore(null);
      setError(err instanceof Error ? err.message : 'Não foi possível analisar esta imagem.');
    } finally {
      setRecognizing(false);
    }
  }

  const relatedMemories = memories.filter(memory => detected && memory.peopleInvolved.includes(detected.name)).slice(0, 3);

  return (
    <Screen scrollable contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="xl" weight="bold" color={theme.colors.blueMemory}>
            Scanner de pessoas
          </Text>
          <Text variant="sm" color={theme.colors.gray500}>
            Reconhecimento consentido com correção manual.
          </Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/scanner/register')}>
          <Ionicons name="person-add-outline" size={22} color={theme.colors.blueMemory} />
        </TouchableOpacity>
      </View>

      <View style={styles.cameraMock}>
        {permission?.granted ? (
          <CameraView ref={cameraRef} style={styles.camera} facing="front">
            <View style={styles.scanFrame}>
              <Ionicons name="scan-outline" size={72} color={theme.colors.whiteSnow} />
            </View>
          </CameraView>
        ) : (
          <TouchableOpacity style={styles.permissionBox} onPress={requestPermission}>
            <Ionicons name="camera-outline" size={54} color={theme.colors.whiteSnow} />
            <Text variant="md" weight="bold" color={theme.colors.whiteSnow} align="center" style={styles.cameraLabel}>
              Ativar câmera
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.recognizeButton} onPress={handleRecognize} disabled={recognizing}>
        <Ionicons name="sparkles-outline" size={20} color={theme.colors.whiteSnow} />
        <Text variant="md" weight="bold" color={theme.colors.whiteSnow} style={styles.recognizeText}>
          {recognizing ? 'Analisando...' : 'Buscar possível identificação'}
        </Text>
      </TouchableOpacity>
      {!!error && <Text variant="sm" color={theme.colors.attention} style={styles.errorText}>{error}</Text>}

      <Card style={styles.resultCard} padding="lg">
        <View style={styles.resultHeader}>
          {detected?.photoUrl ? <Image source={{ uri: detected.photoUrl }} style={styles.personImage} /> : (
            <View style={styles.personAvatar}><Ionicons name="person" size={30} color={theme.colors.whiteSnow} /></View>
          )}
          <View style={styles.resultInfo}>
            <Text variant="lg" weight="bold" color={theme.colors.blueMemory}>
              {detected?.name || 'Nenhuma pessoa cadastrada'}
            </Text>
            <Text variant="sm" color={theme.colors.gray500}>
              {score !== null ? `Possível identificação • ${(score * 100).toFixed(0)}%` : detected?.relation || 'Use a correção manual abaixo'}
            </Text>
          </View>
        </View>
        <Text variant="md" color={theme.colors.readingGraphite} style={styles.description}>
          {detected?.description || 'Capture uma imagem ou selecione manualmente uma pessoa cadastrada com consentimento.'}
        </Text>

        <Text variant="sm" weight="bold" color={theme.colors.gray500} style={styles.sectionTitle}>
          Corrigir identificação
        </Text>
        <View style={styles.peopleRow}>
          {people.map(person => (
            <TouchableOpacity
              key={person.id}
              style={[styles.personChip, detected?.id === person.id && styles.personChipActive]}
              onPress={() => setDetected(person)}
            >
              <Text variant="sm" weight="bold" color={detected?.id === person.id ? theme.colors.whiteSnow : theme.colors.readingGraphite}>
                {person.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card padding="lg">
        <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.sectionTitle}>
          Memórias relacionadas
        </Text>
        {relatedMemories.length > 0 ? relatedMemories.map(memory => (
          <TouchableOpacity key={memory.id} style={styles.memoryRow} onPress={() => router.push(`/memories/${memory.id}`)}>
            <Ionicons name="images-outline" size={20} color={theme.colors.softTerracotta} />
            <Text variant="md" color={theme.colors.readingGraphite} style={styles.memoryText}>{memory.title}</Text>
          </TouchableOpacity>
        )) : (
          <Text variant="md" color={theme.colors.gray500}>Nenhuma memória ligada a essa pessoa ainda.</Text>
        )}
      </Card>

      <Button title="Cadastrar pessoa para scanner" variant="outline" onPress={() => router.push('/scanner/register')} style={styles.button} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.whiteSnow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraMock: {
    height: 260,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.blueMemory,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  camera: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 170,
    height: 170,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: theme.colors.whiteSnow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraLabel: {
    marginTop: theme.spacing.md,
  },
  recognizeButton: {
    backgroundColor: theme.colors.blueMemory,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  recognizeText: {
    marginLeft: theme.spacing.sm,
  },
  errorText: { marginTop: -theme.spacing.sm, marginBottom: theme.spacing.lg, lineHeight: 20 },
  resultCard: {
    marginBottom: theme.spacing.lg,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  personAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.sereneGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  personImage: { width: 60, height: 60, borderRadius: 30, marginRight: theme.spacing.md },
  resultInfo: {
    flex: 1,
  },
  description: {
    lineHeight: 22,
  },
  sectionTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  peopleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  personChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.gray100,
  },
  personChipActive: {
    backgroundColor: theme.colors.blueMemory,
  },
  memoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  memoryText: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  button: {
    marginTop: theme.spacing.lg,
  },
});
