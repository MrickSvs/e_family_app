import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ROLES = ['Adulte', 'Enfant'];

const ADULT_INTERESTS = [
  'Culture',
  'Nature',
  'Gastronomie',
  'Sport',
  'Shopping',
  'Histoire',
  'Art',
  'Relaxation'
];

const CHILD_INTERESTS = [
  'Animaux',
  'Parcs d\'attractions',
  'Plage',
  'Musées interactifs',
  'Sport',
  'Nature',
  'Culture',
  'Jeux'
];

const DIETARY_RESTRICTIONS = [
  'Sans allergènes',
  'Végétarien',
  'Sans gluten',
  'Sans lactose'
];

const COMMON_ACTIVITIES = [
  'Randonnée',
  'Plage',
  'Visites culturelles',
  'Shopping',
  'Sports nautiques',
  'Parcs d\'attractions',
  'Restaurants',
  'Musées',
  'Vélo',
  'Zoo',
  'Spectacles',
  'Activités en plein air'
];

const ENERGY_LEVELS = ['Calme', 'Modéré', 'Très actif'];
const ATTENTION_SPANS = ['Court', 'Moyen', 'Long'];
const COMFORT_LEVELS = ['Basique', 'Confortable', 'Luxe'];
const TRAVEL_EXPERIENCES = ['Débutant', 'Intermédiaire', 'Expert', 'Aventureux', 'Prudent'];

export const FamilyMemberEditor = ({ member, visible, onSave, onClose }) => {
  const { colors } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    first_name: member?.first_name || '',
    last_name: member?.last_name || '',
    role: member?.role || 'Adulte',
    birth_date: member?.birth_date ? new Date(member.birth_date) : new Date(),
    dietary_restrictions: member?.dietary_restrictions ? member.dietary_restrictions.split(',').map(r => r.trim()) : [],
    preferred_activities: member?.preferred_activities || [],
    // Préférences spécifiques pour les adultes
    adult_preferences: member?.adult_preferences || {
      interests: [],
      comfort_level: '',
    },
    // Préférences spécifiques pour les enfants
    child_preferences: member?.child_preferences || {
      interests: [],
      energy_level: '',
      attention_span: '',
    }
  });

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        birth_date: selectedDate,
      }));
    }
  };

  const handleSave = () => {
    if (!formData.first_name.trim()) {
      Alert.alert('Erreur', 'Le prénom est obligatoire');
      return;
    }
    if (formData.role === 'Enfant' && !formData.birth_date) {
      Alert.alert('Erreur', 'La date de naissance est obligatoire pour un enfant');
      return;
    }
    onSave(formData);
  };

  const handleActivitiesChange = (text) => {
    setFormData(prev => ({
      ...prev,
      preferred_activities: text.split(',').map(activity => activity.trim()).filter(Boolean)
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {member ? 'Modifier le membre' : 'Nouveau membre'}
            </Text>
            <TouchableOpacity
              onPress={handleSave}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.container}>
            <View style={styles.section}>
              <Text style={styles.label}>Prénom *</Text>
              <TextInput
                style={styles.input}
                value={formData.first_name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, first_name: text }))}
                placeholder="Prénom"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Nom</Text>
              <TextInput
                style={styles.input}
                value={formData.last_name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, last_name: text }))}
                placeholder="Nom"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Rôle *</Text>
              <View style={styles.chipContainer}>
                {ROLES.map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.chip,
                      formData.role === role && styles.chipSelected
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, role }))}
                  >
                    <Text style={[
                      styles.chipText,
                      formData.role === role && styles.chipTextSelected
                    ]}>
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>
                Date de naissance {formData.role === 'Enfant' ? '*' : ''}
              </Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {formData.birth_date.toLocaleDateString()}
                </Text>
                <Ionicons name="calendar" size={20} color={colors.text} />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={formData.birth_date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}

              {formData.role === 'Adulte' && (
                <View style={styles.preferencesSection}>
                  <Text style={styles.sectionTitle}>Préférences de voyage</Text>

                  <Text style={styles.label}>Centres d'intérêt</Text>
                  <View style={styles.chipContainer}>
                    {ADULT_INTERESTS.map((interest) => (
                      <TouchableOpacity
                        key={interest}
                        style={[
                          styles.chip,
                          formData.adult_preferences.interests.includes(interest) && styles.chipSelected
                        ]}
                        onPress={() => {
                          setFormData(prev => ({
                            ...prev,
                            adult_preferences: {
                              ...prev.adult_preferences,
                              interests: prev.adult_preferences.interests.includes(interest)
                                ? prev.adult_preferences.interests.filter(i => i !== interest)
                                : [...prev.adult_preferences.interests, interest]
                            }
                          }));
                        }}
                      >
                        <Text style={[
                          styles.chipText,
                          formData.adult_preferences.interests.includes(interest) && styles.chipTextSelected
                        ]}>
                          {interest}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.label}>Niveau de confort</Text>
                  <View style={styles.chipContainer}>
                    {COMFORT_LEVELS.map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.chip,
                          formData.adult_preferences.comfort_level === level && styles.chipSelected
                        ]}
                        onPress={() => {
                          setFormData(prev => ({
                            ...prev,
                            adult_preferences: {
                              ...prev.adult_preferences,
                              comfort_level: level
                            }
                          }));
                        }}
                      >
                        <Text style={[
                          styles.chipText,
                          formData.adult_preferences.comfort_level === level && styles.chipTextSelected
                        ]}>
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {formData.role === 'Enfant' && (
                <View style={styles.preferencesSection}>
                  <Text style={styles.sectionTitle}>Préférences de l'enfant</Text>

                  <Text style={styles.label}>Centres d'intérêt</Text>
                  <View style={styles.chipContainer}>
                    {CHILD_INTERESTS.map((interest) => (
                      <TouchableOpacity
                        key={interest}
                        style={[
                          styles.chip,
                          formData.child_preferences.interests.includes(interest) && styles.chipSelected
                        ]}
                        onPress={() => {
                          setFormData(prev => ({
                            ...prev,
                            child_preferences: {
                              ...prev.child_preferences,
                              interests: prev.child_preferences.interests.includes(interest)
                                ? prev.child_preferences.interests.filter(i => i !== interest)
                                : [...prev.child_preferences.interests, interest]
                            }
                          }));
                        }}
                      >
                        <Text style={[
                          styles.chipText,
                          formData.child_preferences.interests.includes(interest) && styles.chipTextSelected
                        ]}>
                          {interest}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.label}>Niveau d'énergie</Text>
                  <View style={styles.chipContainer}>
                    {ENERGY_LEVELS.map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.chip,
                          formData.child_preferences.energy_level === level && styles.chipSelected
                        ]}
                        onPress={() => {
                          setFormData(prev => ({
                            ...prev,
                            child_preferences: {
                              ...prev.child_preferences,
                              energy_level: level
                            }
                          }));
                        }}
                      >
                        <Text style={[
                          styles.chipText,
                          formData.child_preferences.energy_level === level && styles.chipTextSelected
                        ]}>
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.label}>Capacité d'attention</Text>
                  <View style={styles.chipContainer}>
                    {ATTENTION_SPANS.map((span) => (
                      <TouchableOpacity
                        key={span}
                        style={[
                          styles.chip,
                          formData.child_preferences.attention_span === span && styles.chipSelected
                        ]}
                        onPress={() => {
                          setFormData(prev => ({
                            ...prev,
                            child_preferences: {
                              ...prev.child_preferences,
                              attention_span: span
                            }
                          }));
                        }}
                      >
                        <Text style={[
                          styles.chipText,
                          formData.child_preferences.attention_span === span && styles.chipTextSelected
                        ]}>
                          {span}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.preferencesSection}>
                <Text style={styles.sectionTitle}>Préférences générales</Text>

                <Text style={styles.label}>Activités préférées</Text>
                <View style={styles.chipContainer}>
                  {COMMON_ACTIVITIES.map((activity) => (
                    <TouchableOpacity
                      key={activity}
                      style={[
                        styles.chip,
                        formData.preferred_activities.includes(activity) && styles.chipSelected
                      ]}
                      onPress={() => {
                        setFormData(prev => ({
                          ...prev,
                          preferred_activities: prev.preferred_activities.includes(activity)
                            ? prev.preferred_activities.filter(a => a !== activity)
                            : [...prev.preferred_activities, activity]
                        }));
                      }}
                    >
                      <Text style={[
                        styles.chipText,
                        formData.preferred_activities.includes(activity) && styles.chipTextSelected
                      ]}>
                        {activity}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Restrictions alimentaires</Text>
                <View style={styles.chipContainer}>
                  {DIETARY_RESTRICTIONS.map((restriction) => (
                    <TouchableOpacity
                      key={restriction}
                      style={[
                        styles.chip,
                        formData.dietary_restrictions.includes(restriction) && styles.chipSelected
                      ]}
                      onPress={() => {
                        setFormData(prev => ({
                          ...prev,
                          dietary_restrictions: prev.dietary_restrictions.includes(restriction)
                            ? prev.dietary_restrictions.filter(r => r !== restriction)
                            : [...prev.dietary_restrictions, restriction]
                        }));
                      }}
                    >
                      <Text style={[
                        styles.chipText,
                        formData.dietary_restrictions.includes(restriction) && styles.chipTextSelected
                      ]}>
                        {restriction}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#0f8066',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
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
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
  },
  preferencesSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
}); 