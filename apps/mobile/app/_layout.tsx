import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../src/store/AppContext';
import { theme } from '../src/design/theme';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.creamAffection },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="profiles/select" />
        <Stack.Screen name="tabs" />
        <Stack.Screen name="memories/[id]" />
        <Stack.Screen name="memories/create" />
        <Stack.Screen name="people/index" />
        <Stack.Screen name="people/[id]" />
        <Stack.Screen name="visits/roadmap" />
        <Stack.Screen name="visits/active" />
        <Stack.Screen name="visits/summary" />
        <Stack.Screen name="diary/create" />
        <Stack.Screen name="attention-signals/index" />
        <Stack.Screen name="permissions/index" />
        <Stack.Screen name="settings/index" />
        <Stack.Screen name="settings/accessibility" />
        <Stack.Screen name="settings/privacy" />
      </Stack>
    </AppProvider>
  );
}
