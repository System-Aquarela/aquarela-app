import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/ui/Screen';
import { Text } from '../../src/components/ui/Text';
import { Input } from '../../src/components/ui/Input';
import { theme } from '../../src/design/theme';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../../src/services/api.service';
import { profilesService } from '../../src/services/profiles.service';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

const suggestions = [
  'Como iniciar uma visita?',
  'Sugira uma pergunta afetuosa',
  'Como usar memórias sem pressionar?',
];

export default function ChatbotScreen() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Olá, sou o Aquarela. Posso sugerir conversas, memórias e boas práticas de uso do app, sem substituir orientação profissional.' },
  ]);

  async function sendMessage(text = input) {
    if (!text) return;
    const nextMessages: Message[] = [
      ...messages,
      { role: 'user', text },
    ];
    setMessages(nextMessages);
    setInput('');
    try {
      const profile = await profilesService.getSelectedProfile();
      if (!profile) throw new Error('Selecione um perfil.');
      const response = await apiClient.post<{ reply: string }>(`/profiles/${profile.id}/chat`, { message: text });
      setMessages([...nextMessages, { role: 'bot', text: response.reply }]);
    } catch {
      setMessages([...nextMessages, { role: 'bot', text: 'Não consegui falar com o servidor agora. Tente novamente em instantes.' }]);
    }
  }

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.blueMemory} onPress={() => router.back()} />
        <Text variant="xl" weight="bold" color={theme.colors.blueMemory} style={styles.title}>Chatbot Aquarela</Text>
      </View>

      <View style={styles.messages}>
        {messages.map((message, index) => (
          <View key={`${message.role}-${index}`} style={[styles.bubble, message.role === 'user' ? styles.userBubble : styles.botBubble]}>
            <Text variant="md" color={message.role === 'user' ? theme.colors.whiteSnow : theme.colors.readingGraphite} style={styles.messageText}>
              {message.text}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.suggestions}>
        {suggestions.map(item => (
          <TouchableOpacity key={item} style={styles.suggestionChip} onPress={() => sendMessage(item)}>
            <Text variant="sm" weight="bold" color={theme.colors.blueMemory}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputRow}>
        <Input placeholder="Digite uma pergunta" value={input} onChangeText={setInput} style={styles.input} />
        <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage()}>
          <Ionicons name="send" size={20} color={theme.colors.whiteSnow} />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xl },
  title: { marginLeft: theme.spacing.md },
  messages: { gap: theme.spacing.md, marginBottom: theme.spacing.lg },
  bubble: { maxWidth: '86%', borderRadius: theme.radius.lg, padding: theme.spacing.md },
  botBubble: { backgroundColor: theme.colors.whiteSnow, alignSelf: 'flex-start' },
  userBubble: { backgroundColor: theme.colors.blueMemory, alignSelf: 'flex-end' },
  messageText: { lineHeight: 22 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.lg },
  suggestionChip: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderRadius: theme.radius.round, backgroundColor: theme.colors.whiteSnow },
  inputRow: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.sm },
  input: { minHeight: 50 },
  sendButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: theme.colors.blueMemory, justifyContent: 'center', alignItems: 'center' },
});
