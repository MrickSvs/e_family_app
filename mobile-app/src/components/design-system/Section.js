import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

export const Section = ({
  title,
  icon,
  children,
  style,
  headerStyle,
  contentStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.header, headerStyle]}>
        {icon && <Ionicons name={icon} size={24} color={theme.colors.primary} />}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  content: {
    padding: theme.spacing.lg,
  },
}); 