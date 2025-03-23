import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface DietaryPreferencesData {
  restrictions: string[];
  preferences: string[];
}

interface FamilyDietaryPreferencesProps {
  data: DietaryPreferencesData;
  onUpdate: (data: DietaryPreferencesData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const dietaryRestrictions = [
  'Sans gluten',
  'Sans lactose',
  'Végétarien',
  'Végétalien',
  'Sans fruits de mer',
  'Sans arachides',
  'Sans noix',
  'Sans œufs',
];

const dietaryPreferences = [
  'Cuisine traditionnelle',
  'Cuisine du monde',
  'Bio',
  'Local',
  'Fait maison',
  'Healthy',
  'Street food',
  'Gastronomique',
];

export const FamilyDietaryPreferences: React.FC<FamilyDietaryPreferencesProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
}) => {
  const [formData, setFormData] = useState<DietaryPreferencesData>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const toggleRestriction = (restriction: string) => {
    setFormData((prev) => {
      const newRestrictions = prev.restrictions.includes(restriction)
        ? prev.restrictions.filter((r) => r !== restriction)
        : [...prev.restrictions, restriction];
      return { ...prev, restrictions: newRestrictions };
    });
  };

  const togglePreference = (preference: string) => {
    setFormData((prev) => {
      const newPreferences = prev.preferences.includes(preference)
        ? prev.preferences.filter((p) => p !== preference)
        : [...prev.preferences, preference];
      return { ...prev, preferences: newPreferences };
    });
  };

  const handleSubmit = () => {
    onUpdate(formData);
    onNext();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Préférences alimentaires</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Restrictions alimentaires</Text>
        <View style={styles.chipContainer}>
          {dietaryRestrictions.map((restriction) => (
            <TouchableOpacity
              key={restriction}
              style={[
                styles.chip,
                formData.restrictions.includes(restriction) && styles.chipSelected,
              ]}
              onPress={() => toggleRestriction(restriction)}
            >
              <Text
                style={[
                  styles.chipText,
                  formData.restrictions.includes(restriction) &&
                    styles.chipTextSelected,
                ]}
              >
                {restriction}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Préférences culinaires</Text>
        <View style={styles.chipContainer}>
          {dietaryPreferences.map((preference) => (
            <TouchableOpacity
              key={preference}
              style={[
                styles.chip,
                formData.preferences.includes(preference) && styles.chipSelected,
              ]}
              onPress={() => togglePreference(preference)}
            >
              <Text
                style={[
                  styles.chipText,
                  formData.preferences.includes(preference) &&
                    styles.chipTextSelected,
                ]}
              >
                {preference}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={onPrevious}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            Précédent
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Suivant</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#666',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chip: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chipSelected: {
    backgroundColor: '#0f8066',
    borderColor: '#0f8066',
  },
  chipText: {
    color: '#666',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    backgroundColor: '#0f8066',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0f8066',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    color: '#0f8066',
  },
}); 