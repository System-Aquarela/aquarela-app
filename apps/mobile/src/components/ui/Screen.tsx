import React from 'react';
import { StyleSheet, ViewStyle, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../design/theme';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  backgroundColor?: string;
}

export function Screen({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  backgroundColor = theme.colors.creamAffection,
}: ScreenProps) {
  if (scrollable) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }, style]}>
        <ScrollView
          contentContainerStyle={[styles.content, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }, style]}>
      <View style={[styles.content, contentContainerStyle, { flex: 1 }]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: 24, // extra bottom padding for tabbar
  },
});
