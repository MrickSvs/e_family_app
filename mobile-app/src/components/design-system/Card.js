import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const Card = ({
  children,
  variant = 'elevated',
  padding = 'base',
  style,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: theme.colors.background,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'flat':
        return {
          backgroundColor: theme.colors.surface,
        };
      default:
        return {
          backgroundColor: theme.colors.background,
          ...theme.shadows.base,
        };
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'sm':
        return {
          padding: theme.spacing.sm,
        };
      case 'lg':
        return {
          padding: theme.spacing.lg,
        };
      default:
        return {
          padding: theme.spacing.base,
        };
    }
  };

  return (
    <View
      style={[
        styles.card,
        getVariantStyles(),
        getPaddingStyles(),
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.base,
  },
}); 