import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

export const InfoMessage = ({
  icon = 'information-circle',
  message,
  variant = 'info',
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'error':
        return {
          backgroundColor: '#FFEBEE',
          borderColor: theme.colors.error,
        };
      case 'success':
        return {
          backgroundColor: '#E8F5E9',
          borderColor: theme.colors.success,
        };
      default:
        return {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
        };
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'error':
        return theme.colors.error;
      case 'success':
        return theme.colors.success;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <View style={[styles.container, getVariantStyles(), style]}>
      <Ionicons name={icon} size={24} color={getIconColor()} />
      <Text style={[styles.message, { color: theme.colors.text.secondary }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    ...theme.shadows.base,
  },
  message: {
    ...theme.typography.body,
    flex: 1,
    marginLeft: theme.spacing.md,
  },
}); 