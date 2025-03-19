import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const Chip = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected && styles.selectedChip
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.label,
        selected && styles.selectedLabel
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedChip: {
    backgroundColor: '#0f8066',
    borderColor: '#0f8066',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  selectedLabel: {
    color: '#fff',
    fontWeight: '600',
  },
}); 