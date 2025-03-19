import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { theme } from '../../styles/theme';

export const FamilyHeader = ({
  familyName,
  adults,
  children,
  ages,
  travelType,
  budget,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text variant="h2" style={styles.title}>Voyages sélectionnés</Text>
      <Text variant="body" color="secondary" style={styles.subtitle}>
        Famille {familyName} • {adults} adulte{adults > 1 ? "s" : ""}, {children} enfant
        {children > 1 ? "s" : ""} ({ages?.join(", ") || "?"} ans)
      </Text>
      <Text variant="caption" color="secondary" style={styles.info}>
        Type de voyage : {Array.isArray(travelType) ? travelType.join(", ") : "Non spécifié"} • Budget : {budget}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F5ED',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    marginBottom: theme.spacing.xs,
  },
  info: {
    opacity: 0.8,
  },
}); 