import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useApp } from '../../src/store/AppContext';
import { peopleService } from '../../src/services/people.service';
import { scannerService } from '../../src/services/scanner.service';
import { Person } from '../../src/types/person.types';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ScannerRegisterScreen() {
  const router = useRouter();
  const { selectedProfile } = useApp();
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [story, setStory] = useState('');
  const [faceUris, setFaceUris] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function pickFacePhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: Math.max(1, 5 - faceUris.length),
      quality: 0.85,
    });
    if (!result.canceled) {
      setFaceUris(current => [...current, ...result.assets.map(asset => asset.uri)].slice(0, 5));
    }
  }

  async function takeFacePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError('Autorize a câmera para registrar a foto de treinamento.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled) setFaceUris(current => [...current, result.assets[0].uri].slice(0, 5));
  }

  async function handleSave() {
    if (!selectedProfile || !name || !relation) return;
    setLoading(true);
    setError('');
    try {
      const person: Person = {
        id: `peo-${Date.now()}`,
        profileId: selectedProfile.id,
        name: name.trim(),
        relation: relation.trim(),
        birthDate,
        description: story || `${relation} de ${selectedProfile.name}.`,
        stories: story ? [story] : [],
        sharedMoments: [],
        lastInteraction: 'Cadastro criado agora',
        scannerConsent: consent,
      };
      const savedPerson = await peopleService.addPerson(person);
      for (const uri of faceUris) {
        await scannerService.uploadFaceImage(savedPerson.id, uri);
      }
      router.replace('/tabs/scanner');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível concluir o cadastro.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} onPress={() => router.back()} />
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>
          Cadastro para scanner
        </Text>
      </View>

      <Text variant="md" color={theme.colors.gray500} style={styles.description}>
        A foto autorizada alimenta o reconhecimento local via API e exige consentimento explícito. A identificação sempre pode ser corrigida manualmente.
      </Text>

      <Input label="Nome" placeholder="Ex: Maria" value={name} onChangeText={setName} />
      <Input label="Parentesco ou vínculo" placeholder="Ex: Filha, amigo, cuidador" value={relation} onChangeText={setRelation} />
      <Input label="Data de nascimento" placeholder="Ex: 12/04/1978" value={birthDate} onChangeText={setBirthDate} />
      <Input
        label="Histórias e detalhes"
        placeholder="O que ajuda a pessoa acompanhada a reconhecer esse vínculo?"
        value={story}
        onChangeText={setStory}
        multiline
        numberOfLines={4}
        style={styles.textArea}
      />

      <Text variant="sm" weight="bold" color={theme.colors.readingGraphite} style={styles.photoLabel}>Fotos de treinamento ({faceUris.length}/5)</Text>
      <Text variant="xs" color={theme.colors.gray500} style={styles.photoHelp}>Use de 2 a 5 fotos frontais, individuais e bem iluminadas para melhorar a precisão.</Text>
      {faceUris.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewRow}>
          {faceUris.map((uri, index) => (
            <TouchableOpacity key={`${uri}-${index}`} onPress={() => setFaceUris(current => current.filter((_, itemIndex) => itemIndex !== index))}>
              <Image source={{ uri }} style={styles.preview} />
              <View style={styles.removeBadge}><Ionicons name="close" size={14} color={theme.colors.whiteSnow} /></View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <View style={styles.photoActions}>
        <TouchableOpacity style={styles.photoRow} onPress={takeFacePhoto} disabled={faceUris.length >= 5}>
          <Ionicons name="camera-outline" size={24} color={theme.colors.blueMemory} />
          <Text variant="sm" weight="bold" color={theme.colors.blueMemory} style={styles.photoText}>Câmera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoRow} onPress={pickFacePhoto} disabled={faceUris.length >= 5}>
          <Ionicons name="images-outline" size={24} color={theme.colors.blueMemory} />
          <Text variant="sm" weight="bold" color={theme.colors.blueMemory} style={styles.photoText}>Galeria</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.consentRow} onPress={() => setConsent(!consent)}>
        <Ionicons name={consent ? 'checkbox' : 'square-outline'} size={28} color={consent ? theme.colors.sereneGreen : theme.colors.gray400} />
        <Text variant="md" color={theme.colors.readingGraphite} style={styles.consentText}>
          Tenho autorização familiar para usar esses dados no scanner do Aquarela.
        </Text>
      </TouchableOpacity>

      {!!error && <Text variant="sm" color={theme.colors.calmError} style={styles.error}>{error}</Text>}
      <Button title={loading ? 'Salvando e analisando...' : 'Salvar cadastro'} onPress={handleSave} disabled={loading || !name || !relation || !consent || faceUris.length === 0} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    marginLeft: theme.spacing.md,
  },
  description: {
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.blueMemory,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    flex: 1,
    justifyContent: 'center',
  },
  photoText: {
    marginLeft: theme.spacing.sm,
  },
  photoLabel: { marginBottom: theme.spacing.xs },
  photoHelp: { lineHeight: 18, marginBottom: theme.spacing.sm },
  photoActions: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.md },
  previewRow: { gap: theme.spacing.sm, paddingVertical: theme.spacing.sm },
  preview: { width: 72, height: 72, borderRadius: 18 },
  removeBadge: { position: 'absolute', right: -3, top: -3, width: 22, height: 22, borderRadius: 11, backgroundColor: theme.colors.calmError, alignItems: 'center', justifyContent: 'center' },
  error: { marginBottom: theme.spacing.md },
  consentText: {
    flex: 1,
    marginLeft: theme.spacing.md,
    lineHeight: 22,
  },
});
