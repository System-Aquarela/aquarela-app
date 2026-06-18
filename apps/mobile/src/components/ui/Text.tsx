import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { theme } from '../../design/theme';
import { useAccessibility } from '../../store/AccessibilityContext';

interface TextProps extends RNTextProps {
  variant?: keyof typeof theme.typography.size;
  weight?: keyof typeof theme.typography.weight;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export function Text({
  variant = 'md',
  weight = 'regular',
  color = theme.colors.readingGraphite,
  align = 'left',
  style,
  children,
  ...props
}: TextProps) {
  const { largeText, highContrast } = useAccessibility();
  return (
    <RNText
      style={[
        {
          fontSize: theme.typography.size[variant] * (largeText ? 1.18 : 1),
          fontWeight: theme.typography.weight[weight],
          color: highContrast && color === theme.colors.readingGraphite ? '#000000' : color,
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}
