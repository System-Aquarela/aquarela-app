import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { peopleService } from '../../src/services/people.service';
import { Person } from '../../src/types/person.types';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../src/components/ui/Button';

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);

  useEffect(() => {
    if (typeof id === 'string') peopleService.getPerson(id).then(setPerson);
  }, [id]);

  if (!person) return null;

  async function toggleScannerConsent() {
    if (!person) return;
    const updated = await peopleService.updatePerson(person.id, { scannerConsent: !person.scannerConsent });
    setPerson(updated);
  }

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} onPress={() => router.back()} />
      </View>

      <View style={styles.profileSection}>
        {person.photoUrl ? <Image source={{ uri: person.photoUrl }} style={styles.avatarImage} /> : (
          <View style={styles.avatarPlaceholder}><Ionicons name="person" size={60} color={theme.colors.whiteSnow} /></View>
        )}
        <Text variant="xxl" weight="bold" color={theme.colors.blueMemory} style={styles.name}>{person.name}</Text>
        <Text variant="lg" color={theme.colors.gray500}>{person.relation}</Text>
      </View>

      <Card style={styles.section}>
        <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.sectionTitle}>Descrição</Text>
        <Text variant="md" style={styles.text}>{person.description}</Text>
      </Card>

      <Card style={styles.section}>
        <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.sectionTitle}>Momentos compartilhados</Text>
        {(person.sharedMoments || []).map(moment => (
          <View key={moment} style={styles.listRow}>
            <Ionicons name="images-outline" size={18} color={theme.colors.softTerracotta} />
            <Text variant="md" color={theme.colors.readingGraphite} style={styles.listText}>{moment}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.sectionPhrase}>
        <View style={styles.row}>
          <Ionicons name="scan-outline" size={24} color={theme.colors.sereneGreen} />
          <Text variant="lg" weight="bold" color={theme.colors.sereneGreen} style={styles.sectionTitleIcon}>Scanner</Text>
        </View>
        <Text variant="md" style={styles.text}>
          {person.scannerConsent ? 'Autorizado para reconhecimento no scanner.' : 'Sem consentimento para scanner. Use identificação manual.'}
        </Text>
      </Card>

      <Button
        title={person.scannerConsent ? 'Revogar reconhecimento facial' : 'Autorizar reconhecimento facial'}
        variant={person.scannerConsent ? 'danger' : 'outline'}
        onPress={toggleScannerConsent}
        style={styles.consentButton}
      />

      {person.supportPhrase && (
        <Card style={styles.sectionPhrase}>
          <View style={styles.row}>
            <Ionicons name="chatbubble-ellipses" size={24} color={theme.colors.sereneGreen} />
            <Text variant="lg" weight="bold" color={theme.colors.sereneGreen} style={styles.sectionTitleIcon}>Frase de apoio</Text>
          </View>
          <Text variant="md" style={styles.phrase}>"{person.supportPhrase}"</Text>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: theme.spacing.lg },
  profileSection: { alignItems: 'center', marginBottom: theme.spacing.xl },
  avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: theme.colors.sereneGreen, justifyContent: 'center', alignItems: 'center', marginBottom: theme.spacing.md },
  avatarImage: { width: 120, height: 120, borderRadius: 60, marginBottom: theme.spacing.md },
  name: { marginBottom: theme.spacing.xs },
  section: { marginBottom: theme.spacing.md },
  sectionPhrase: { marginBottom: theme.spacing.md, backgroundColor: '#F0FDF4', borderColor: theme.colors.sereneGreen, borderWidth: 1 },
  sectionTitle: { marginBottom: theme.spacing.sm },
  sectionTitleIcon: { marginLeft: theme.spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm },
  text: { lineHeight: 24 },
  phrase: { fontStyle: 'italic', fontWeight: '500', color: theme.colors.sereneGreen },
  listRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm },
  listText: { marginLeft: theme.spacing.sm, flex: 1 },
  consentButton: { marginBottom: theme.spacing.xl },
});
