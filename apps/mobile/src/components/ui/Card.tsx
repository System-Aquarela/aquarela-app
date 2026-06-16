import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { theme } from '../../design/theme';

interface CardProps extends ViewProps {
  padding?: keyof typeof theme.spacing;
  variant?: 'elevated' | 'outline' | 'flat';
}

export function Card({ padding = 'md', variant = 'elevated', style, children, ...props }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        { padding: theme.spacing[padding] },
        styles[variant],
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.whiteSnow,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  outline: {
    borderWidth: 1,
    borderColor: theme.colors.gray200,
  },
  flat: {
    backgroundColor: theme.colors.gray100,
  },
});
