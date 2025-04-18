import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  AccessibilityInfo,
  Image,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

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
  'Découvertes culturelles',
  'Aventures nature',
  'Ateliers créatifs',
  'Rencontres & Partage',
  'Saveurs locales',
  'Légendes & Histoire',
  'Sports & Jeux',
  'Vie quotidienne',
  'Découvertes sensorielles'
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

const STEPS = [
  { id: 'basic', title: 'Profil', icon: 'person' },
  { id: 'interests', title: 'Passions', icon: 'heart' },
  { id: 'preferences', title: 'Voyage', icon: 'settings' },
];

const MOBILITY_PREFERENCES = [
  'Marche prolongée',
  'Transports en commun',
  'Véhicule privé',
  'Vélo/Trottinette',
  'Accessibilité PMR nécessaire'
];

const PACE_PREFERENCES = [
  'Détente (peu d\'activités)',
  'Équilibré (2-3 activités/jour)',
  'Intense (journées bien remplies)'
];

const LEARNING_STYLES = [
  'Visuel',
  'Auditif',
  'Participatif',
  'Lecture',
  'Expérimentation'
];

const SOCIAL_PREFERENCES = [
  'Activités en groupe',
  'Moments en famille',
  'Temps calme seul',
  'Rencontres locales'
];

const SPECIAL_NEEDS = [
  'Sieste nécessaire',
  'Repas à heures fixes',
  'Temps calme régulier',
  'Adaptation lumière/son',
  'Routine importante'
];

const TIME_PREFERENCES = [
  'Matinal',
  'Activités en journée',
  'Soirées animées',
  'Flexible'
];

export const FamilyMemberEditor = ({ member, visible, onSave, onClose }) => {
  const { colors } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [progress] = useState(new Animated.Value(0));
  const [activeStep, setActiveStep] = useState('basic');
  const slideAnim = useRef(new Animated.Value(0)).current;
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
      pace: '',
      time_preferences: [],
      learning_styles: [],
      social_preferences: [],
      mobility_preferences: [],
    },
    // Préférences spécifiques pour les enfants
    child_preferences: member?.child_preferences || {
      interests: [],
      energy_level: '',
      attention_span: '',
      special_needs: [],
      pace: '',
      time_preferences: [],
      learning_styles: [],
      social_preferences: [],
      mobility_preferences: [],
    }
  });

  const triggerHapticFeedback = async (type) => {
    try {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        switch (type) {
          case 'light':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case 'error':
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
          case 'success':
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
        }
      }
    } catch (error) {
      // Silently fail if haptics are not available
      console.debug('Haptics not available:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const validateField = (field, value) => {
    switch (field) {
      case 'first_name':
        return value.trim() ? '' : 'Le prénom est obligatoire';
      case 'birth_date':
        return formData.role === 'Enfant' && !value ? 'La date de naissance est obligatoire pour un enfant' : '';
      default:
        return '';
    }
  };

  const handleFieldChange = (field, value) => {
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    if (!error) {
      triggerHapticFeedback('light');
    }
    
    // Handle nested object updates
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = () => {
    const errors = {};
    let hasErrors = false;

    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setValidationErrors(errors);
      triggerHapticFeedback('error');
      return;
    }

    triggerHapticFeedback('success');
    onSave(formData);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        birth_date: selectedDate,
      }));
    }
  };

  const handleActivitiesChange = (text) => {
    setFormData(prev => ({
      ...prev,
      preferred_activities: text.split(',').map(activity => activity.trim()).filter(Boolean)
    }));
  };

  const handleStepChange = (stepId) => {
    if (stepId === activeStep) return;
    
    // Animate out current content
    Animated.timing(slideAnim, {
      toValue: -1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setActiveStep(stepId);
      // Animate in new content
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handlePreferenceChange = (field, value) => {
    const [parent, child] = field.split('.');
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: Array.isArray(value) ? value : value
      }
    }));
    triggerHapticFeedback('light');
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {STEPS.map((step) => (
        <TouchableOpacity
          key={step.id}
          style={[
            styles.stepButton,
            activeStep === step.id && styles.stepButtonActive
          ]}
          onPress={() => handleStepChange(step.id)}
        >
          <Ionicons
            name={step.icon}
            size={20}
            color={activeStep === step.id ? '#fff' : '#666'}
          />
          <Text style={[
            styles.stepButtonText,
            activeStep === step.id && styles.stepButtonTextActive
          ]}>
            {step.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderBasicInfo = () => (
    <View style={styles.section}>
      <View style={styles.basicInfoCard}>
        <View style={styles.basicInfoHeader}>
          <Ionicons name="person" size={24} color="#0f8066" />
          <Text style={styles.basicInfoTitle}>Informations personnelles</Text>
        </View>
        <View style={styles.basicInfoContent}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Prénom *</Text>
            <TextInput
              style={[styles.input, validationErrors.first_name && styles.inputError]}
              value={formData.first_name}
              onChangeText={(text) => handleFieldChange('first_name', text)}
              placeholder="Prénom"
              placeholderTextColor="#999"
            />
            {validationErrors.first_name && (
              <Text style={styles.errorText}>{validationErrors.first_name}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              value={formData.last_name}
              onChangeText={(text) => handleFieldChange('last_name', text)}
              placeholder="Nom"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Rôle *</Text>
            <View style={styles.chipContainer}>
              {ROLES.map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[styles.chip, formData.role === role && styles.chipSelected]}
                  onPress={() => handleFieldChange('role', role)}
                >
                  <Text style={[styles.chipText, formData.role === role && styles.chipTextSelected]}>
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.fieldContainer}>
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
          </View>
        </View>
      </View>
    </View>
  );

  const renderInterestsSection = () => (
    <View style={styles.preferencesContainer}>
      <View style={styles.preferenceCard}>
        <View style={styles.preferenceHeader}>
          <Ionicons name="heart" size={24} color="#0f8066" />
          <Text style={styles.preferenceTitle}>Centres d'intérêt</Text>
        </View>
        <Text style={styles.preferenceDescription}>
          Découvrez des destinations et activités adaptées à vos passions
        </Text>
        <View style={styles.chipContainer}>
          {(formData.role === 'Adulte' ? ADULT_INTERESTS : CHILD_INTERESTS).map((interest) => {
            const preferences = formData.role === 'Adulte' ? formData.adult_preferences : formData.child_preferences;
            const isSelected = preferences.interests.includes(interest);
            return (
              <TouchableOpacity
                key={interest}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => {
                  const newInterests = isSelected
                    ? preferences.interests.filter(i => i !== interest)
                    : [...preferences.interests, interest];
                  handlePreferenceChange(
                    `${formData.role === 'Adulte' ? 'adult_preferences' : 'child_preferences'}.interests`,
                    newInterests
                  );
                }}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {interest}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  const renderPreferencesSection = () => (
    <View style={styles.preferencesContainer}>
      {formData.role === 'Adulte' ? (
        <>
          {/* Style de voyage */}
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceHeader}>
              <Ionicons name="settings" size={24} color="#0f8066" />
              <Text style={styles.preferenceTitle}>Style de voyage</Text>
            </View>
            <Text style={styles.preferenceDescription}>
              Définissez vos préférences de confort et de rythme
            </Text>
            <View style={styles.chipContainer}>
              {COMFORT_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.chip,
                    formData.adult_preferences.comfort_level === level && styles.chipSelected
                  ]}
                  onPress={() => handlePreferenceChange('adult_preferences.comfort_level', level)}
                >
                  <Text style={[
                    styles.chipText,
                    formData.adult_preferences.comfort_level === level && styles.chipTextSelected
                  ]}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.chipContainer}>
              {PACE_PREFERENCES.map((pref) => (
                <TouchableOpacity
                  key={pref}
                  style={[
                    styles.chip,
                    formData.adult_preferences.pace === pref && styles.chipSelected
                  ]}
                  onPress={() => handlePreferenceChange('adult_preferences.pace', pref)}
                >
                  <Text style={[
                    styles.chipText,
                    formData.adult_preferences.pace === pref && styles.chipTextSelected
                  ]}>{pref}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Organisation journalière */}
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceHeader}>
              <Ionicons name="time" size={24} color="#0f8066" />
              <Text style={styles.preferenceTitle}>Organisation journalière</Text>
            </View>
            <Text style={styles.preferenceDescription}>
              Précisez vos moments préférés et vos besoins alimentaires
            </Text>
            <View style={styles.chipContainer}>
              {TIME_PREFERENCES.map((pref) => (
                <TouchableOpacity
                  key={pref}
                  style={[
                    styles.chip,
                    formData.adult_preferences.time_preferences.includes(pref) && styles.chipSelected
                  ]}
                  onPress={() => {
                    const newPreferences = formData.adult_preferences.time_preferences.includes(pref)
                      ? formData.adult_preferences.time_preferences.filter(p => p !== pref)
                      : [...formData.adult_preferences.time_preferences, pref];
                    handlePreferenceChange('adult_preferences.time_preferences', newPreferences);
                  }}
                >
                  <Text style={[
                    styles.chipText,
                    formData.adult_preferences.time_preferences.includes(pref) && styles.chipTextSelected
                  ]}>{pref}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.chipContainer}>
              {DIETARY_RESTRICTIONS.map((restriction) => (
                <TouchableOpacity
                  key={restriction}
                  style={[
                    styles.chip,
                    formData.dietary_restrictions.includes(restriction) && styles.chipSelected
                  ]}
                  onPress={() => {
                    const newRestrictions = formData.dietary_restrictions.includes(restriction)
                      ? formData.dietary_restrictions.filter(r => r !== restriction)
                      : [...formData.dietary_restrictions, restriction];
                    handleFieldChange('dietary_restrictions', newRestrictions);
                  }}
                >
                  <Text style={[
                    styles.chipText,
                    formData.dietary_restrictions.includes(restriction) && styles.chipTextSelected
                  ]}>{restriction}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Mode de découverte */}
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceHeader}>
              <Ionicons name="compass" size={24} color="#0f8066" />
              <Text style={styles.preferenceTitle}>Mode de découverte</Text>
            </View>
            <Text style={styles.preferenceDescription}>
              Comment préférez-vous explorer et vous déplacer ?
            </Text>
            <View style={styles.chipContainer}>
              {LEARNING_STYLES.map((style) => (
                <TouchableOpacity
                  key={style}
                  style={[
                    styles.chip,
                    formData.adult_preferences.learning_styles.includes(style) && styles.chipSelected
                  ]}
                  onPress={() => {
                    const newStyles = formData.adult_preferences.learning_styles.includes(style)
                      ? formData.adult_preferences.learning_styles.filter(s => s !== style)
                      : [...formData.adult_preferences.learning_styles, style];
                    handlePreferenceChange('adult_preferences.learning_styles', newStyles);
                  }}
                >
                  <Text style={[
                    styles.chipText,
                    formData.adult_preferences.learning_styles.includes(style) && styles.chipTextSelected
                  ]}>{style}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.chipContainer}>
              {MOBILITY_PREFERENCES.map((pref) => (
                <TouchableOpacity
                  key={pref}
                  style={[
                    styles.chip,
                    formData.adult_preferences.mobility_preferences.includes(pref) && styles.chipSelected
                  ]}
                  onPress={() => {
                    const newPreferences = formData.adult_preferences.mobility_preferences.includes(pref)
                      ? formData.adult_preferences.mobility_preferences.filter(p => p !== pref)
                      : [...formData.adult_preferences.mobility_preferences, pref];
                    handlePreferenceChange('adult_preferences.mobility_preferences', newPreferences);
                  }}
                >
                  <Text style={[
                    styles.chipText,
                    formData.adult_preferences.mobility_preferences.includes(pref) && styles.chipTextSelected
                  ]}>{pref}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Aspect social */}
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceHeader}>
              <Ionicons name="people" size={24} color="#0f8066" />
              <Text style={styles.preferenceTitle}>Aspect social</Text>
            </View>
            <Text style={styles.preferenceDescription}>
              Comment souhaitez-vous interagir pendant votre voyage ?
            </Text>
            <View style={styles.chipContainer}>
              {SOCIAL_PREFERENCES.map((pref) => (
                <TouchableOpacity
                  key={pref}
                  style={[
                    styles.chip,
                    formData.adult_preferences.social_preferences.includes(pref) && styles.chipSelected
                  ]}
                  onPress={() => {
                    const newPreferences = formData.adult_preferences.social_preferences.includes(pref)
                      ? formData.adult_preferences.social_preferences.filter(p => p !== pref)
                      : [...formData.adult_preferences.social_preferences, pref];
                    handlePreferenceChange('adult_preferences.social_preferences', newPreferences);
                  }}
                >
                  <Text style={[
                    styles.chipText,
                    formData.adult_preferences.social_preferences.includes(pref) && styles.chipTextSelected
                  ]}>{pref}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      ) : (
        <>
          {/* Rythme & Énergie */}
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceHeader}>
              <Ionicons name="battery" size={24} color="#0f8066" />
              <Text style={styles.preferenceTitle}>Rythme & Énergie</Text>
            </View>
            <Text style={styles.preferenceDescription}>
              Définissez le niveau d'énergie et la capacité d'attention
            </Text>
            <View style={styles.chipContainer}>
              {ENERGY_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.chip,
                    formData.child_preferences.energy_level === level && styles.chipSelected
                  ]}
                  onPress={() => handlePreferenceChange('child_preferences.energy_level', level)}
                >
                  <Text style={[
                    styles.chipText,
                    formData.child_preferences.energy_level === level && styles.chipTextSelected
                  ]}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.chipContainer}>
              {ATTENTION_SPANS.map((span) => (
                <TouchableOpacity
                  key={span}
                  style={[
                    styles.chip,
                    formData.child_preferences.attention_span === span && styles.chipSelected
                  ]}
                  onPress={() => handlePreferenceChange('child_preferences.attention_span', span)}
                >
                  <Text style={[
                    styles.chipText,
                    formData.child_preferences.attention_span === span && styles.chipTextSelected
                  ]}>{span}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Besoins essentiels */}
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceHeader}>
              <Ionicons name="heart" size={24} color="#0f8066" />
              <Text style={styles.preferenceTitle}>Besoins essentiels</Text>
            </View>
            <Text style={styles.preferenceDescription}>
              Précisez les besoins spécifiques et les restrictions alimentaires
            </Text>
            <View style={styles.chipContainer}>
              {SPECIAL_NEEDS.map((need) => (
                <TouchableOpacity
                  key={need}
                  style={[
                    styles.chip,
                    formData.child_preferences.special_needs.includes(need) && styles.chipSelected
                  ]}
                  onPress={() => {
                    const newNeeds = formData.child_preferences.special_needs.includes(need)
                      ? formData.child_preferences.special_needs.filter(n => n !== need)
                      : [...formData.child_preferences.special_needs, need];
                    handlePreferenceChange('child_preferences.special_needs', newNeeds);
                  }}
                >
                  <Text style={[
                    styles.chipText,
                    formData.child_preferences.special_needs.includes(need) && styles.chipTextSelected
                  ]}>{need}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.chipContainer}>
              {DIETARY_RESTRICTIONS.map((restriction) => (
                <TouchableOpacity
                  key={restriction}
                  style={[
                    styles.chip,
                    formData.dietary_restrictions.includes(restriction) && styles.chipSelected
                  ]}
                  onPress={() => {
                    const newRestrictions = formData.dietary_restrictions.includes(restriction)
                      ? formData.dietary_restrictions.filter(r => r !== restriction)
                      : [...formData.dietary_restrictions, restriction];
                    handleFieldChange('dietary_restrictions', newRestrictions);
                  }}
                >
                  <Text style={[
                    styles.chipText,
                    formData.dietary_restrictions.includes(restriction) && styles.chipTextSelected
                  ]}>{restriction}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Organisation journalière */}
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceHeader}>
              <Ionicons name="time" size={24} color="#0f8066" />
              <Text style={styles.preferenceTitle}>Organisation journalière</Text>
            </View>
            <Text style={styles.preferenceDescription}>
              Définissez les moments préférés et le rythme de voyage
            </Text>
            <View style={styles.chipContainer}>
              {TIME_PREFERENCES.map((pref) => (
                <TouchableOpacity
                  key={pref}
                  style={[
                    styles.chip,
                    formData.child_preferences.time_preferences.includes(pref) && styles.chipSelected
                  ]}
                  onPress={() => {
                    const newPreferences = formData.child_preferences.time_preferences.includes(pref)
                      ? formData.child_preferences.time_preferences.filter(p => p !== pref)
                      : [...formData.child_preferences.time_preferences, pref];
                    handlePreferenceChange('child_preferences.time_preferences', newPreferences);
                  }}
                >
                  <Text style={[
                    styles.chipText,
                    formData.child_preferences.time_preferences.includes(pref) && styles.chipTextSelected
                  ]}>{pref}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.chipContainer}>
              {PACE_PREFERENCES.map((pref) => (
                <TouchableOpacity
                  key={pref}
                  style={[
                    styles.chip,
                    formData.child_preferences.pace === pref && styles.chipSelected
                  ]}
                  onPress={() => handlePreferenceChange('child_preferences.pace', pref)}
                >
                  <Text style={[
                    styles.chipText,
                    formData.child_preferences.pace === pref && styles.chipTextSelected
                  ]}>{pref}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Mode de découverte */}
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceHeader}>
              <Ionicons name="compass" size={24} color="#0f8066" />
              <Text style={styles.preferenceTitle}>Mode de découverte</Text>
            </View>
            <Text style={styles.preferenceDescription}>
              Comment votre enfant préfère-t-il apprendre et se déplacer ?
            </Text>
            <View style={styles.chipContainer}>
              {LEARNING_STYLES.map((style) => (
                <TouchableOpacity
                  key={style}
                  style={[
                    styles.chip,
                    formData.child_preferences.learning_styles.includes(style) && styles.chipSelected
                  ]}
                  onPress={() => {
                    const newStyles = formData.child_preferences.learning_styles.includes(style)
                      ? formData.child_preferences.learning_styles.filter(s => s !== style)
                      : [...formData.child_preferences.learning_styles, style];
                    handlePreferenceChange('child_preferences.learning_styles', newStyles);
                  }}
                >
                  <Text style={[
                    styles.chipText,
                    formData.child_preferences.learning_styles.includes(style) && styles.chipTextSelected
                  ]}>{style}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.chipContainer}>
              {MOBILITY_PREFERENCES.map((pref) => (
                <TouchableOpacity
                  key={pref}
                  style={[
                    styles.chip,
                    formData.child_preferences.mobility_preferences.includes(pref) && styles.chipSelected
                  ]}
                  onPress={() => {
                    const newPreferences = formData.child_preferences.mobility_preferences.includes(pref)
                      ? formData.child_preferences.mobility_preferences.filter(p => p !== pref)
                      : [...formData.child_preferences.mobility_preferences, pref];
                    handlePreferenceChange('child_preferences.mobility_preferences', newPreferences);
                  }}
                >
                  <Text style={[
                    styles.chipText,
                    formData.child_preferences.mobility_preferences.includes(pref) && styles.chipTextSelected
                  ]}>{pref}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Aspect social */}
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceHeader}>
              <Ionicons name="people" size={24} color="#0f8066" />
              <Text style={styles.preferenceTitle}>Aspect social</Text>
            </View>
            <Text style={styles.preferenceDescription}>
              Comment votre enfant interagit-il avec les autres ?
            </Text>
            <View style={styles.chipContainer}>
              {SOCIAL_PREFERENCES.map((pref) => (
                <TouchableOpacity
                  key={pref}
                  style={[
                    styles.chip,
                    formData.child_preferences.social_preferences.includes(pref) && styles.chipSelected
                  ]}
                  onPress={() => {
                    const newPreferences = formData.child_preferences.social_preferences.includes(pref)
                      ? formData.child_preferences.social_preferences.filter(p => p !== pref)
                      : [...formData.child_preferences.social_preferences, pref];
                    handlePreferenceChange('child_preferences.social_preferences', newPreferences);
                  }}
                >
                  <Text style={[
                    styles.chipText,
                    formData.child_preferences.social_preferences.includes(pref) && styles.chipTextSelected
                  ]}>{pref}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      )}
    </View>
  );

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

          {renderStepIndicator()}

          <Animated.View style={[
            styles.contentContainer,
            {
              transform: [{
                translateX: slideAnim.interpolate({
                  inputRange: [-1, 0],
                  outputRange: [300, 0]
                })
              }]
            }
          ]}>
            <ScrollView style={styles.container}>
              {activeStep === 'basic' && renderBasicInfo()}
              {activeStep === 'interests' && renderInterestsSection()}
              {activeStep === 'preferences' && renderPreferencesSection()}
            </ScrollView>
          </Animated.View>
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
  fieldContainer: {
    marginBottom: 16,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    gap: 8,
  },
  chip: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chipSelected: {
    backgroundColor: '#0f8066',
    borderColor: '#0f8066',
    transform: [{ scale: 1.05 }],
  },
  chipText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
  },
  preferencesContainer: {
    padding: 16,
    gap: 16,
  },
  preferenceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  preferenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  preferenceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  preferenceSubsection: {
    marginTop: 16,
  },
  preferenceSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  stepIndicator: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 8,
  },
  stepButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  stepButtonActive: {
    backgroundColor: '#0f8066',
  },
  stepButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  stepButtonTextActive: {
    color: '#fff',
  },
  basicInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  basicInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  basicInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  basicInfoContent: {
    gap: 16,
  },
  contentContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#0f8066',
    borderColor: '#0f8066',
  },
  optionText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
  },
}); 