import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StepIndicator } from '../../components/StepIndicator';
import { FamilyBasicInfo } from './steps/FamilyBasicInfo';
import { FamilyDietaryPreferences } from './steps/FamilyDietaryPreferences';
import { FamilyMembers } from './steps/FamilyMembers';
import { FamilyActivities } from './steps/FamilyActivities';

const steps = [
  { id: 0, title: 'Informations de base' },
  { id: 1, title: 'Préférences alimentaires' },
  { id: 2, title: 'Membres de la famille' },
  { id: 3, title: 'Activités préférées' },
];

export const ProfilePage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    basicInfo: {
      familyName: '',
      description: '',
    },
    dietaryPreferences: {
      restrictions: [],
      preferences: [],
    },
    members: [],
    activities: {
      preferred: [],
      excluded: [],
      travel_preferences: {
        travel_type: [],
        budget: 'Non spécifié',
        accommodation_type: 'Non spécifié',
        travel_pace: 'Non spécifié',
        travel_experience: []
      }
    },
  });

  const handleUpdateFormData = (stepData: any, step: number) => {
    setFormData(prev => {
      const newData = { ...prev };
      switch (step) {
        case 0:
          newData.basicInfo = stepData;
          break;
        case 1:
          newData.dietaryPreferences = stepData;
          break;
        case 2:
          newData.members = stepData;
          break;
        case 3:
          newData.activities = stepData;
          break;
      }
      return newData;
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <FamilyBasicInfo
            data={formData.basicInfo}
            onUpdate={(data) => handleUpdateFormData(data, 0)}
            onNext={() => setCurrentStep(1)}
          />
        );
      case 1:
        return (
          <FamilyDietaryPreferences
            data={formData.dietaryPreferences}
            onUpdate={(data) => handleUpdateFormData(data, 1)}
            onNext={() => setCurrentStep(2)}
            onPrevious={() => setCurrentStep(0)}
          />
        );
      case 2:
        return (
          <FamilyMembers
            data={formData.members}
            onUpdate={(data) => handleUpdateFormData(data, 2)}
            onNext={() => setCurrentStep(3)}
            onPrevious={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <FamilyActivities
            data={formData.activities}
            onUpdate={(data) => handleUpdateFormData(data, 3)}
            onPrevious={() => setCurrentStep(2)}
            onComplete={() => console.log('Complete', formData)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        onStepPress={setCurrentStep}
      />
      {renderStep()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
}); 