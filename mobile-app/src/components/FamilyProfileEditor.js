import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text, Button, TextInput, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Chip } from './Chip';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TRAVEL_TYPES = [
  { id: 'Culture', label: 'Culture', icon: '🏛️' },
  { id: 'Nature', label: 'Nature', icon: '🌲' },
  { id: 'Plage', label: 'Plage', icon: '🏖️' },
  { id: 'Sport', label: 'Sport', icon: '⚽' },
  { id: 'Découverte', label: 'Découverte', icon: '🗺️' },
  { id: 'Détente', label: 'Détente', icon: '🧘‍♀️' },
  { id: 'Aventure', label: 'Aventure', icon: '🏃‍♂️' },
  { id: 'Non spécifié', label: 'Non spécifié', icon: '❓' }
];

const BUDGET_RANGES = [
  { id: 'economic', label: 'Économique', description: '< 1000€/pers' },
  { id: 'moderate', label: 'Modéré', description: '1000€-2000€/pers' },
  { id: 'luxury', label: 'Luxe', description: '> 2000€/pers' },
];

const TRAVEL_EXPERIENCE_LEVELS = [
  { id: 'Débutant', label: 'Débutant', icon: '🌱' },
  { id: 'Intermédiaire', label: 'Intermédiaire', icon: '🌿' },
  { id: 'Expert', label: 'Expert', icon: '🌳' },
  { id: 'Aventureux', label: 'Aventureux', icon: '🏃‍♂️' },
  { id: 'Prudent', label: 'Prudent', icon: '🛡️' }
];

export const FamilyProfileEditor = ({ member, onSave }) => {
  const { colors } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    basic_info: {
      birth_date: member?.birth_date ? new Date(member.birth_date) : new Date(),
      specific_needs: member?.specific_needs || '',
      mobility_requirements: member?.mobility_requirements || '',
      medical_needs: member?.medical_needs || '',
    },
    dietary_preferences: {
      diet_type: member?.dietary_preferences?.diet_type || '',
      allergies: member?.dietary_preferences?.allergies || [],
      restrictions: member?.dietary_preferences?.restrictions || [],
    },
    travel_preferences: {
      travel_types: member?.travel_preferences?.travel_types || [],
      budget_range: member?.travel_preferences?.budget_range || 'moderate',
      preferred_activities: member?.travel_preferences?.preferred_activities || [],
      accommodation_type: member?.travel_preferences?.accommodation_type || [],
      transport_preferences: member?.travel_preferences?.transport_preferences || [],
      travel_pace: member?.travel_preferences?.travel_pace || 'moderate',
      travel_experience: member?.travel_preferences?.travel_experience || [],
    },
    important_dates: member?.important_dates || [],
  });

  const handleSave = () => {
    onSave(formData);
  };

  const toggleTravelType = (typeId) => {
    setFormData(prev => ({
      ...prev,
      travel_preferences: {
        ...prev.travel_preferences,
        travel_types: prev.travel_preferences.travel_types.includes(typeId)
          ? prev.travel_preferences.travel_types.filter(id => id !== typeId)
          : [...prev.travel_preferences.travel_types, typeId],
      },
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        basic_info: {
          ...prev.basic_info,
          birth_date: selectedDate,
        },
      }));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {/* Section Informations de base */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de base</Text>
          
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              label="Date de naissance"
              value={format(formData.basic_info.birth_date, 'dd/MM/yyyy', { locale: fr })}
              editable={false}
              right={<TextInput.Icon name="calendar" />}
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.basic_info.birth_date}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          <TextInput
            label="Besoins spécifiques"
            value={formData.basic_info.specific_needs}
            onChangeText={(text) => setFormData(prev => ({
              ...prev,
              basic_info: { ...prev.basic_info, specific_needs: text },
            }))}
            multiline
          />
        </View>

        {/* Section Préférences de voyage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Types de voyage préférés</Text>
          <View style={styles.chipContainer}>
            {TRAVEL_TYPES.map((type) => (
              <Chip
                key={type.id}
                selected={formData.travel_preferences.travel_types.includes(type.id)}
                onPress={() => toggleTravelType(type.id)}
                style={styles.chip}
              >
                {`${type.icon} ${type.label}`}
              </Chip>
            ))}
          </View>
        </View>

        {/* Section Expérience de voyage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expérience de voyage</Text>
          <View style={styles.chipContainer}>
            {TRAVEL_EXPERIENCE_LEVELS.map((level) => (
              <Chip
                key={level.id}
                selected={formData.travel_preferences.travel_experience.includes(level.id)}
                onPress={() => {
                  setFormData(prev => ({
                    ...prev,
                    travel_preferences: {
                      ...prev.travel_preferences,
                      travel_experience: prev.travel_preferences.travel_experience.includes(level.id)
                        ? prev.travel_preferences.travel_experience.filter(id => id !== level.id)
                        : [...prev.travel_preferences.travel_experience, level.id],
                    },
                  }));
                }}
                style={styles.chip}
              >
                {`${level.icon} ${level.label}`}
              </Chip>
            ))}
          </View>
        </View>

        {/* Section Budget */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget par personne</Text>
          <View style={styles.chipContainer}>
            {BUDGET_RANGES.map((range) => (
              <Chip
                key={range.id}
                selected={formData.travel_preferences.budget_range === range.id}
                onPress={() => setFormData(prev => ({
                  ...prev,
                  travel_preferences: {
                    ...prev.travel_preferences,
                    budget_range: range.id,
                  },
                }))}
                style={styles.chip}
              >
                {`${range.label}\n${range.description}`}
              </Chip>
            ))}
          </View>
        </View>

        {/* Section Régime alimentaire */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences alimentaires</Text>
          <TextInput
            label="Régime alimentaire"
            value={formData.dietary_preferences.diet_type}
            onChangeText={(text) => setFormData(prev => ({
              ...prev,
              dietary_preferences: { ...prev.dietary_preferences, diet_type: text },
            }))}
          />
          <TextInput
            label="Allergies"
            value={formData.dietary_preferences.allergies.join(', ')}
            onChangeText={(text) => setFormData(prev => ({
              ...prev,
              dietary_preferences: {
                ...prev.dietary_preferences,
                allergies: text.split(',').map(item => item.trim()).filter(Boolean),
              },
            }))}
            placeholder="Séparées par des virgules"
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
        >
          Enregistrer les modifications
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chip: {
    margin: 4,
  },
  saveButton: {
    marginVertical: 24,
  },
}); 