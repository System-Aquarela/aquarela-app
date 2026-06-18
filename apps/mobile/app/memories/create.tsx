import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useApp } from '../../src/store/AppContext';
import { memoriesService } from '../../src/services/memories.service';
import { mediaService, UploadedAsset } from '../../src/services/media.service';
import { Memory, MemoryCategory, MemoryMediaType } from '../../src/types/memory.types';
import { peopleService } from '../../src/services/people.service';
import { Person } from '../../src/types/person.types';

const mediaOptions: Array<{ type: MemoryMediaType; label: string; icon: any }> = [
  { type: 'foto', label: 'Foto', icon: 'camera-outline' },
  { type: 'video', label: 'Vídeo', icon: 'videocam-outline' },
  { type: 'audio', label: 'Áudio', icon: 'mic-outline' },
  { type: 'documento', label: 'Documento', icon: 'document-text-outline' },
  { type: 'texto', label: 'Texto', icon: 'reader-outline' },
  { type: 'musica', label: 'Música', icon: 'musical-notes-outline' },
];

const categories: MemoryCategory[] = ['Infância', 'Adolescência', 'Vida adulta', 'Família', 'Trabalho', 'Viagens', 'Conquistas', 'Músicas', 'Documentos'];

export default function CreateMemoryScreen() {
  const router = useRouter();
  const { selectedProfile } = useApp();
  const [mediaType, setMediaType] = useState<MemoryMediaType>('foto');
  const [category, setCategory] = useState<MemoryCategory>('Família');
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState('');
  const [location, setLocation] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [story, setStory] = useState('');
  const [asset, setAsset] = useState<UploadedAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    peopleService.getPeople().then(setPeople).catch(() => setPeople([]));
  }, []);

  async function pickMedia() {
    if (mediaType === 'documento' || mediaType === 'audio' || mediaType === 'musica') {
      const types = mediaType === 'documento' ? ['application/pdf', 'text/plain'] : ['audio/*'];
      const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true, type: types });
      if (result.canceled) return;
      const file = result.assets[0];
      const uploaded = await mediaService.upload(file.uri, file.name, file.mimeType || 'application/octet-stream');
      setAsset(uploaded);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType === 'video' ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (result.canceled) return;
    const file = result.assets[0];
    const name = file.fileName || `memory-${Date.now()}.${mediaType === 'video' ? 'mp4' : 'jpg'}`;
    const mimeType = file.mimeType || (mediaType === 'video' ? 'video/mp4' : 'image/jpeg');
    const uploaded = await mediaService.upload(file.uri, name, mimeType);
    setAsset(uploaded);
  }

  async function handleSave() {
    if (!selectedProfile || !title || !story) return;
    setLoading(true);
    setError('');
    try {
      const memory: Memory = {
        id: `m-${Date.now()}`,
        profileId: selectedProfile.id,
        title: title.trim(),
        period: period.trim() || 'Sem data definida',
        story: story.trim(),
        category,
        peopleInvolved: people.filter(person => selectedPeople.includes(person.id)).map(person => person.name),
        peopleIds: selectedPeople,
        suggestedPhrase: `Você se lembra de ${title.trim()}?`,
        previousReaction: 'Ainda sem reação registrada.',
        isSensitive: category === 'Sensíveis',
        isFavorite: false,
        mediaType,
        mediaId: asset?.id,
        imageUrl: asset?.url,
        location: location.trim(),
        createdAt: new Date().toISOString(),
      };
      await memoriesService.addMemory(memory);
      router.replace('/tabs/memories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a memória.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="close" size={28} color={theme.colors.blueMemory} />
        </TouchableOpacity>
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.headerTitle}>
          Nova memória
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <Text variant="md" color={theme.colors.gray500} style={styles.subtitle}>
        Salve uma lembrança no perfil acompanhado e anexe fotos, vídeos ou documentos quando fizer sentido.
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsRow}>
        {mediaOptions.map(option => {
          const selected = mediaType === option.type;
          return (
            <TouchableOpacity key={option.type} style={[styles.option, selected && styles.optionSelected]} onPress={() => { setMediaType(option.type); setAsset(null); }}>
              <Ionicons name={option.icon} size={22} color={selected ? theme.colors.whiteSnow : theme.colors.blueMemory} />
              <Text variant="sm" weight="bold" color={selected ? theme.colors.whiteSnow : theme.colors.readingGraphite} style={styles.optionText}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {mediaType !== 'texto' && (
        <TouchableOpacity style={styles.uploadBox} onPress={pickMedia}>
          <Ionicons name={asset ? 'checkmark-circle-outline' : 'cloud-upload-outline'} size={24} color={asset ? theme.colors.sereneGreen : theme.colors.blueMemory} />
          <Text variant="md" weight="bold" color={theme.colors.blueMemory} style={styles.uploadText}>
            {asset ? 'Arquivo enviado' : 'Selecionar e enviar arquivo'}
          </Text>
        </TouchableOpacity>
      )}

      <Input label="Título" placeholder="Ex: Viagem para Ubatuba" value={title} onChangeText={setTitle} />
      <Input label="Data ou período" placeholder="Ex: Verão de 1998" value={period} onChangeText={setPeriod} />
      <Input label="Local" placeholder="Ex: Praia Grande, Ubatuba" value={location} onChangeText={setLocation} />
      <Text variant="sm" weight="medium" style={styles.label}>Pessoas envolvidas</Text>
      <View style={styles.peopleGrid}>
        {people.length === 0 ? <Text variant="sm" color={theme.colors.gray500}>Cadastre pessoas importantes para vinculá-las à memória.</Text> : people.map(person => {
          const selected = selectedPeople.includes(person.id);
          return (
            <TouchableOpacity key={person.id} style={[styles.personPill, selected && styles.personSelected]} onPress={() => setSelectedPeople(current => selected ? current.filter(id => id !== person.id) : [...current, person.id])}>
              <Ionicons name={selected ? 'checkmark-circle' : 'person-circle-outline'} size={18} color={selected ? theme.colors.whiteSnow : theme.colors.blueMemory} />
              <Text variant="sm" weight="bold" color={selected ? theme.colors.whiteSnow : theme.colors.readingGraphite} style={styles.personText}>{person.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text variant="sm" weight="medium" style={styles.label}>Categoria</Text>
      <View style={styles.categoryGrid}>
        {categories.map(item => {
          const selected = category === item;
          return (
            <TouchableOpacity key={item} style={[styles.categoryPill, selected && styles.categorySelected]} onPress={() => setCategory(item)}>
              <Text variant="sm" weight="bold" color={selected ? theme.colors.whiteSnow : theme.colors.readingGraphite}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Input
        label="História da lembrança"
        placeholder="Conte a história de forma acolhedora"
        value={story}
        onChangeText={setStory}
        multiline
        numberOfLines={5}
        style={styles.textArea}
      />

      {!!error && <Text variant="sm" color={theme.colors.calmError} style={styles.error}>{error}</Text>}
      <Button title={loading ? 'Salvando...' : 'Salvar memória'} onPress={handleSave} disabled={loading || !title || !story} style={styles.saveButton} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  optionsRow: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  option: {
    width: 96,
    minHeight: 78,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.whiteSnow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gray200,
  },
  optionSelected: {
    backgroundColor: theme.colors.blueMemory,
    borderColor: theme.colors.blueMemory,
  },
  optionText: {
    marginTop: theme.spacing.xs,
  },
  uploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.blueMemory,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.whiteSnow,
  },
  uploadText: {
    marginLeft: theme.spacing.sm,
  },
  label: {
    marginBottom: theme.spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  peopleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.md },
  personPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderRadius: theme.radius.round, backgroundColor: theme.colors.whiteSnow, borderWidth: 1, borderColor: theme.colors.gray200 },
  personSelected: { backgroundColor: theme.colors.sereneGreen, borderColor: theme.colors.sereneGreen },
  personText: { marginLeft: theme.spacing.xs },
  error: { marginBottom: theme.spacing.md },
  categoryPill: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.whiteSnow,
    borderWidth: 1,
    borderColor: theme.colors.gray200,
  },
  categorySelected: {
    backgroundColor: theme.colors.blueMemory,
    borderColor: theme.colors.blueMemory,
  },
  textArea: {
    minHeight: 130,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginBottom: theme.spacing.xl,
  },
});
