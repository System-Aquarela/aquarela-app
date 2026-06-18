import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { theme } from '../../src/design/theme';
import { useApp } from '../../src/store/AppContext';
import { profilesService } from '../../src/services/profiles.service';
import { mediaService } from '../../src/services/media.service';

function listFromText(value: string) {
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

export default function ManageProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const creating = params.mode === 'create';
  const { selectedProfile, selectProfile } = useApp();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [subjects, setSubjects] = useState('');
  const [songs, setSongs] = useState('');
  const [sensitiveTopics, setSensitiveTopics] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!creating && selectedProfile) {
      setName(selectedProfile.name);
      setNickname(selectedProfile.nickname || '');
      setAge(String(selectedProfile.age || ''));
      setCity(selectedProfile.city || '');
      setSubjects(selectedProfile.favoriteSubjects.join(', '));
      setSongs(selectedProfile.favoriteSongs.join(', '));
      setSensitiveTopics(selectedProfile.sensitiveTopics.join(', '));
      setPhotoUri(selectedProfile.photoUrl || null);
    }
  }, [creating, selectedProfile]);

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  }

  async function save() {
    const parsedAge = Number(age);
    if (!name.trim() || !Number.isInteger(parsedAge) || parsedAge < 0 || parsedAge > 130) {
      setError('Informe nome e idade válida.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      let profile = creating
        ? await profilesService.createProfile({ name: name.trim(), nickname: nickname.trim(), age: parsedAge, city: city.trim() })
        : selectedProfile;
      if (!profile) throw new Error('Selecione um perfil para editar.');
      await selectProfile(profile);

      let photoMediaId: string | undefined;
      if (photoUri && photoUri !== profile.photoUrl) {
        const asset = await mediaService.upload(photoUri, `perfil-${Date.now()}.jpg`, 'image/jpeg');
        photoMediaId = asset.id;
      }

      profile = await profilesService.updateProfile(profile.id, {
        name: name.trim(),
        nickname: nickname.trim(),
        age: parsedAge,
        city: city.trim(),
        favoriteSubjects: listFromText(subjects),
        favoriteSongs: listFromText(songs),
        sensitiveTopics: listFromText(sensitiveTopics),
        ...(photoMediaId ? { photoMediaId } : {}),
      });
      await selectProfile(profile);
      router.replace(creating ? '/tabs/home' : '/tabs/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar o perfil.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scrollable contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Voltar">
          <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} />
        </TouchableOpacity>
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>
          {creating ? 'Nova pessoa acompanhada' : 'Editar perfil'}
        </Text>
      </View>

      <TouchableOpacity style={styles.photoButton} onPress={pickPhoto} accessibilityLabel="Escolher foto do perfil">
        {photoUri ? <Image source={{ uri: photoUri }} style={styles.photo} /> : <Ionicons name="person" size={52} color={theme.colors.whiteSnow} />}
        <View style={styles.cameraBadge}><Ionicons name="camera" size={18} color={theme.colors.whiteSnow} /></View>
      </TouchableOpacity>

      <Input label="Nome" value={name} onChangeText={setName} placeholder="Nome da pessoa acompanhada" />
      <Input label="Como prefere ser chamada" value={nickname} onChangeText={setNickname} placeholder="Apelido ou nome afetivo" />
      <Input label="Idade" value={age} onChangeText={setAge} keyboardType="number-pad" placeholder="Ex: 82" />
      <Input label="Cidade" value={city} onChangeText={setCity} placeholder="Cidade, estado" />
      <Input label="Assuntos favoritos" value={subjects} onChangeText={setSubjects} placeholder="Separe por vírgulas" multiline />
      <Input label="Músicas favoritas" value={songs} onChangeText={setSongs} placeholder="Separe por vírgulas" multiline />
      <Input label="Temas sensíveis" value={sensitiveTopics} onChangeText={setSensitiveTopics} placeholder="Separe por vírgulas" multiline />
      {!!error && <Text variant="sm" color={theme.colors.calmError} style={styles.error}>{error}</Text>}
      <Button title={loading ? 'Salvando...' : 'Salvar perfil'} onPress={save} disabled={loading} icon={loading ? <ActivityIndicator color={theme.colors.whiteSnow} /> : undefined} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 48 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.lg },
  title: { marginLeft: theme.spacing.md, flex: 1 },
  photoButton: {
    width: 112,
    height: 112,
    borderRadius: 32,
    backgroundColor: theme.colors.sereneGreen,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  photo: { width: '100%', height: '100%', borderRadius: 32 },
  cameraBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.blueMemory,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.creamAffection,
  },
  error: { marginBottom: theme.spacing.md },
});
