import React from 'react';
import { View, StyleSheet } from 'react-native';

const OnboardingProgress = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { width: `${progress}%` }
          ]} 
        />
      </View>
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.stepDot,
              index < currentStep && styles.stepDotActive,
              index === currentStep - 1 && styles.stepDotCurrent,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#F6F7F8',
  },
  progressBar: {
    height: 2,
    backgroundColor: '#585F66',
    opacity: 0.2,
    borderRadius: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 1,
    backgroundColor: '#003526',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 16,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#585F66',
    opacity: 0.2,
    marginHorizontal: 3,
  },
  stepDotActive: {
    backgroundColor: '#003526',
    opacity: 1,
  },
  stepDotCurrent: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#003526',
    opacity: 1,
  },
});

export default OnboardingProgress; 