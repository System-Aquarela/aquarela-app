import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native';
import { theme } from '../../design/theme';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {label && (
        <Text variant="sm" weight="medium" style={styles.label}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          style,
        ]}
        placeholderTextColor={theme.colors.gray400}
        {...props}
      />
      {error && (
        <Text variant="xs" color={theme.colors.calmError} style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  label: {
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.size.md,
    color: theme.colors.readingGraphite,
    backgroundColor: theme.colors.whiteSnow,
  },
  inputError: {
    borderColor: theme.colors.calmError,
  },
  error: {
    marginTop: theme.spacing.xs,
  },
});
