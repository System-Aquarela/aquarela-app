import { Tabs as ExpoTabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/design/theme';

export default function TabsLayout() {
  return (
    <ExpoTabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.readingGraphite,
        tabBarInactiveTintColor: theme.colors.gray500,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: theme.colors.creamAffection,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 80,
          paddingBottom: theme.spacing.md,
          paddingTop: theme.spacing.sm,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: theme.typography.weight.bold,
          marginTop: 4,
        },
      }}
    >
      <ExpoTabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainerHome]}>
              <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
            </View>
          ),
        }}
      />
      <ExpoTabs.Screen
        name="memories"
        options={{
          title: 'Memories',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainerHome]}>
              <Ionicons name={focused ? "book" : "book-outline"} size={size} color={color} />
            </View>
          ),
        }}
      />
      <ExpoTabs.Screen
        name="visit"
        options={{
          title: 'Visit',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainerHome]}>
              <Ionicons name={focused ? "calendar" : "calendar-outline"} size={size} color={color} />
            </View>
          ),
        }}
      />
      <ExpoTabs.Screen
        name="diary"
        options={{
          title: 'Diary',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainerHome]}>
              <Ionicons name={focused ? "create" : "create-outline"} size={size} color={color} />
            </View>
          ),
        }}
      />
      <ExpoTabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconContainerHome]}>
              <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
            </View>
          ),
        }}
      />
    </ExpoTabs>
  );
}

import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  iconContainer: {
    width: 56,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconContainerHome: {
    backgroundColor: '#FF9C8F', // Like softTerracotta but a bit lighter/brighter
  }
});
