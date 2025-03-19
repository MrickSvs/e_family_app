import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const OnboardingOption = ({ 
  label, 
  selected, 
  onPress, 
  icon,
  description,
  style,
  textStyle
}) => {
  const content = (
    <View style={[styles.content, style]}>
      {icon && <View style={[
        styles.iconContainer,
        selected && styles.selectedIconContainer
      ]}>{icon}</View>}
      <View style={styles.textContainer}>
        <Text style={[styles.label, textStyle, selected && styles.selectedLabel]}>
          {label}
        </Text>
        {description && (
          <Text style={[styles.description, selected && styles.selectedDescription]}>
            {description}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.container,
        selected ? styles.selectedContainer : styles.unselectedContainer
      ]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginBottom: 12,
    elevation: 0,
  },
  unselectedContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#585F66',
  },
  selectedContainer: {
    backgroundColor: '#003526',
    borderWidth: 1,
    borderColor: '#003526',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
    opacity: 0.8,
  },
  selectedIconContainer: {
    opacity: 1,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2226',
    letterSpacing: 0.2,
  },
  selectedLabel: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: '#585F66',
    marginTop: 4,
    letterSpacing: 0.1,
  },
  selectedDescription: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
});

export default OnboardingOption; 