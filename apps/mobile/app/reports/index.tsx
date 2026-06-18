import React, { useEffect, useState } from 'react';
import { Alert, Linking, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { insightsService, ConnectionSummary, ReportSummary } from '../../src/services/insights.service';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ReportsScreen() {
  const router = useRouter();
  const [connection, setConnection] = useState<ConnectionSummary | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    const [insightsData, reportData] = await Promise.all([
      insightsService.getRemoteInsights(),
      insightsService.getRemoteReport(),
    ]);
    setConnection(reportData.connection);
    setInsights(insightsData.insights);
    setReport(reportData.report);
  }

  async function exportPdf() {
    try {
      setExporting(true);
      const exported = await insightsService.exportReport();
      await Linking.openURL(exported.url);
    } catch (error) {
      Alert.alert('Não foi possível gerar o PDF', error instanceof Error ? error.message : 'Tente novamente em instantes.');
    } finally {
      setExporting(false);
    }
  }

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} onPress={() => router.back()} />
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>Relatórios e insights</Text>
      </View>

      <Card style={styles.scoreCard} padding="lg">
        <View style={styles.scoreCircle}>
          <Text variant="huge" weight="bold" color={theme.colors.blueMemory}>{connection?.score || 0}</Text>
        </View>
        <Text variant="lg" weight="bold" color={theme.colors.blueMemory} align="center">Índice de conexão familiar</Text>
        <Text variant="md" color={theme.colors.gray500} align="center" style={styles.description}>{connection?.detail}</Text>
      </Card>

      <View style={styles.statGrid}>
        <Stat label="Humor" value={report?.mood || '-'} icon="happy-outline" />
        <Stat label="Interações" value={`${report?.interactions || 0}`} icon="chatbubbles-outline" />
        <Stat label="Memórias" value={`${report?.memoriesAccessed || 0}`} icon="images-outline" />
        <Stat label="Reconhecimento" value={report?.recognition || '-'} icon="people-outline" />
      </View>

      <Text variant="lg" weight="bold" color={theme.colors.blueMemory} style={styles.sectionTitle}>Insights afetivos</Text>
      {insights.map(item => (
        <Card key={item} style={styles.insightCard} padding="lg">
          <Ionicons name="sparkles-outline" size={22} color={theme.colors.softTerracotta} />
          <Text variant="md" color={theme.colors.readingGraphite} style={styles.insightText}>{item}</Text>
        </Card>
      ))}

      <Button
        title={exporting ? 'Gerando PDF...' : 'Exportar PDF'}
        icon={<Ionicons name="document-text-outline" size={20} color={theme.colors.whiteSnow} />}
        onPress={exportPdf}
        disabled={exporting}
      />

      <Text variant="sm" color={theme.colors.gray500} style={styles.footerNote}>
        Exportação local ativa para testes. Relatórios avançados continuam sinalizados como recurso premium.
      </Text>
    </Screen>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: any }) {
  return (
    <Card style={styles.statCard} padding="md">
      <Ionicons name={icon} size={22} color={theme.colors.blueMemory} />
      <Text variant="xs" weight="bold" color={theme.colors.gray500} style={styles.statLabel}>{label}</Text>
      <Text variant="md" weight="bold" color={theme.colors.readingGraphite} numberOfLines={2}>{value}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xl },
  title: { marginLeft: theme.spacing.md },
  scoreCard: { alignItems: 'center', marginBottom: theme.spacing.lg },
  scoreCircle: { width: 110, height: 110, borderRadius: 55, borderWidth: 8, borderColor: theme.colors.sereneGreen, alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.md },
  description: { marginTop: theme.spacing.sm, lineHeight: 22 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md, marginBottom: theme.spacing.lg },
  statCard: { width: '47%' },
  statLabel: { marginTop: theme.spacing.sm, marginBottom: theme.spacing.xs },
  sectionTitle: { marginBottom: theme.spacing.md },
  insightCard: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: theme.spacing.md },
  insightText: { flex: 1, marginLeft: theme.spacing.md, lineHeight: 22 },
  footerNote: { marginVertical: theme.spacing.lg, lineHeight: 20 },
});
