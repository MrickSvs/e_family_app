import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Step {
  id: number;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepPress: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepPress,
}) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <TouchableOpacity
            style={[
              styles.step,
              currentStep === index && styles.activeStep,
              currentStep > index && styles.completedStep,
            ]}
            onPress={() => onStepPress(index)}
          >
            <Text
              style={[
                styles.stepNumber,
                (currentStep === index || currentStep > index) && styles.activeStepText,
              ]}
            >
              {index + 1}
            </Text>
            <Text
              style={[
                styles.stepTitle,
                (currentStep === index || currentStep > index) && styles.activeStepText,
              ]}
            >
              {step.title}
            </Text>
          </TouchableOpacity>
          {index < steps.length - 1 && (
            <View
              style={[
                styles.connector,
                currentStep > index && styles.activeConnector,
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  step: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    color: '#757575',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  activeStep: {
    opacity: 1,
  },
  completedStep: {
    opacity: 1,
  },
  activeStepText: {
    color: '#0f8066',
    backgroundColor: '#E8F5E9',
  },
  connector: {
    height: 2,
    flex: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  activeConnector: {
    backgroundColor: '#0f8066',
  },
}); 