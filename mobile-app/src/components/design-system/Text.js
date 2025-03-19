import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const Text = ({
  children,
  variant = 'body',
  color = 'primary',
  style,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: theme.typography.fontSize['3xl'],
          fontWeight: 'bold',
          lineHeight: theme.typography.lineHeight.tight,
        };
      case 'h2':
        return {
          fontSize: theme.typography.fontSize['2xl'],
          fontWeight: 'bold',
          lineHeight: theme.typography.lineHeight.tight,
        };
      case 'h3':
        return {
          fontSize: theme.typography.fontSize.xl,
          fontWeight: '600',
          lineHeight: theme.typography.lineHeight.tight,
        };
      case 'subtitle':
        return {
          fontSize: theme.typography.fontSize.lg,
          fontWeight: '500',
          lineHeight: theme.typography.lineHeight.normal,
        };
      case 'caption':
        return {
          fontSize: theme.typography.fontSize.xs,
          lineHeight: theme.typography.lineHeight.normal,
        };
      default:
        return {
          fontSize: theme.typography.fontSize.base,
          lineHeight: theme.typography.lineHeight.normal,
        };
    }
  };

  const getColorStyles = () => {
    switch (color) {
      case 'secondary':
        return { color: theme.colors.text.secondary };
      case 'disabled':
        return { color: theme.colors.text.disabled };
      default:
        return { color: theme.colors.text.primary };
    }
  };

  return (
    <RNText
      style={[styles.text, getVariantStyles(), getColorStyles(), style]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: theme.typography.fontFamily.regular,
  },
}); 