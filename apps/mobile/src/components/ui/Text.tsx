import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { theme } from '../../design/theme';

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
  return (
    <RNText
      style={[
        {
          fontSize: theme.typography.size[variant],
          fontWeight: theme.typography.weight[weight],
          color,
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
