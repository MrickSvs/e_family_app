import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

export const Input = ({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  helper,
  error,
  style,
  inputStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelContainer}>
        {icon && <Ionicons name={icon} size={20} color={theme.colors.text.secondary} />}
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.placeholder}
        {...props}
      />
      {(helper || error) && (
        <Text style={[styles.helper, error && styles.errorText]}>
          {error || helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    fontWeight: '500',
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  helper: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  errorText: {
    color: theme.colors.error,
  },
}); 