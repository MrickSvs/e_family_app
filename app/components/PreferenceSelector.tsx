import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PreferenceSelectorProps {
  title: string;
  options: string[];
  selected: string[];
  onChange: (value: string) => void;
}

export const PreferenceSelector = ({ 
  title, 
  options, 
  selected, 
  onChange 
}: PreferenceSelectorProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              selected.includes(option) && styles.optionSelected
            ]}
            onPress={() => onChange(option)}
          >
            <Text style={[
              styles.optionText,
              selected.includes(option) && styles.optionTextSelected
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  optionSelected: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    color: '#666',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#fff',
  },
}); 