import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const OnboardingButton = ({ 
  onPress, 
  title, 
  variant = 'primary', 
  icon,
  disabled = false,
  style,
  textStyle
}) => {
  const buttonContent = (
    <View style={[styles.buttonContent, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[
        styles.buttonText, 
        textStyle, 
        variant === 'secondary' && styles.secondaryText,
        disabled && styles.disabledText
      ]}>
        {title}
      </Text>
    </View>
  );

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[styles.secondaryButton, disabled && styles.disabledButton]}
      >
        {buttonContent}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.buttonContainer, disabled && styles.disabledButton]}
    >
      {buttonContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#FFE44E',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    elevation: 0,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#585F66',
    padding: 16,
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  buttonText: {
    color: '#1F2226',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  secondaryText: {
    color: '#585F66',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#585F66',
  },
});

export default OnboardingButton; 