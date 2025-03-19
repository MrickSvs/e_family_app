import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getProfile, updateFamilyProfile, addFamilyMember } from '../services/profileService';
import { Chip } from '../components/Chip';

const TRAVEL_TYPES = ['Découverte', 'Aventure', 'Détente', 'Culture'];
const BUDGET_RANGES = ['Économique', 'Modéré', 'Confort', 'Luxe'];
const ACTIVITIES = ['Sport', 'Culture', 'Nature', 'Gastronomie', 'Shopping', 'Histoire'];

export default function FamilyProfileScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState(null);

  // States pour stocker les infos du formulaire
  const [familyName, setFamilyName] = useState('');
  const [adults, setAdults] = useState('');
  const [children, setChildren] = useState('');
  const [ages, setAges] = useState('');

  const [travelType, setTravelType] = useState('');
  const [budget, setBudget] = useState('');
  const [frequency, setFrequency] = useState('');

  const [allergies, setAllergies] = useState('');
  const [constraints, setConstraints] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfile();
      setProfile(data);
      // Pré-remplir les champs si le profil existe
      if (data) {
        setFamilyName(data.family_name || '');
        setTravelType(data.travel_type || '');
        setBudget(data.budget || '');
        setSelectedActivities(data.interests || []);
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement du profil:", error);
      let errorMessage = "Impossible de charger le profil";
      
      // Vérifier si c'est une erreur de validation
      try {
        const parsedError = JSON.parse(error.message);
        if (parsedError.errors) {
          errorMessage = parsedError.errors.map(err => `${err.field}: ${err.message}`).join('\n');
        }
      } catch (e) {
        // Si ce n'est pas une erreur JSON, on garde le message d'origine
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!familyName.trim()) {
          setError("Le nom de famille est requis");
          return false;
        }
        if (!adults || parseInt(adults) < 1) {
          setError("Au moins un adulte est requis");
          return false;
        }
        break;
      case 2:
        if (!travelType) {
          setError("Le type de voyage est requis");
          return false;
        }
        if (!budget) {
          setError("Le budget est requis");
          return false;
        }
        break;
      case 3:
        // Pas de validation obligatoire pour les contraintes
        break;
      case 4:
        if (selectedActivities.length === 0) {
          setError("Sélectionnez au moins une activité");
          return false;
        }
        break;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Action finale (étape 4 -> Terminer)
  const handleFinish = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Mettre à jour le profil familial
      await updateFamilyProfile({
        family_name: familyName,
        interests: selectedActivities,
        travel_preferences: {
          travel_type: travelType,
          budget: budget,
          frequency: frequency
        }
      });

      // Ajouter les membres de la famille
      const numAdults = parseInt(adults);
      const numChildren = parseInt(children);
      const childrenAges = ages.split(',').map(age => parseInt(age.trim()));

      // Ajouter les adultes
      for (let i = 0; i < numAdults; i++) {
        await addFamilyMember({
          first_name: `Adulte ${i + 1}`,
          role: 'Adulte',
          dietary_restrictions: allergies
        });
      }

      // Ajouter les enfants
      for (let i = 0; i < numChildren; i++) {
        await addFamilyMember({
          first_name: `Enfant ${i + 1}`,
          role: 'Enfant',
          birth_date: new Date().toISOString().split('T')[0], // À mettre à jour avec l'âge réel
          dietary_restrictions: allergies
        });
      }

      Alert.alert('Succès', 'Votre profil familial a été mis à jour avec succès !');
      navigation.goBack();
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde:", error);
      let errorMessage = "Impossible de sauvegarder le profil";
      
      // Vérifier si c'est une erreur de validation
      try {
        const parsedError = JSON.parse(error.message);
        if (parsedError.errors) {
          errorMessage = parsedError.errors.map(err => `${err.field}: ${err.message}`).join('\n');
        }
      } catch (e) {
        // Si ce n'est pas une erreur JSON, on garde le message d'origine
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const toggleActivity = (activity) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0f8066" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const renderStep1 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Informations de base</Text>

      <Text style={styles.label}>Nom de la famille 👨‍👩‍👧‍👦</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : Les Martin"
        value={familyName}
        onChangeText={setFamilyName}
      />

      <Text style={styles.label}>Nombre d'adultes 👤</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : 2"
        value={adults}
        onChangeText={setAdults}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Nombre d'enfants 👶</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : 2"
        value={children}
        onChangeText={setChildren}
        keyboardType="numeric"
      />

      {parseInt(children) > 0 && (
        <>
          <Text style={styles.label}>Âges des enfants 🎂</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex : 5, 8, 12"
            value={ages}
            onChangeText={setAges}
          />
        </>
      )}
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Préférences de Voyage</Text>

      <Text style={styles.label}>Type de voyage préféré 🌍</Text>
      <View style={styles.chipContainer}>
        {TRAVEL_TYPES.map(type => (
          <Chip
            key={type}
            label={type}
            selected={travelType === type}
            onPress={() => setTravelType(type)}
          />
        ))}
      </View>

      <Text style={styles.label}>Budget moyen 💰</Text>
      <View style={styles.chipContainer}>
        {BUDGET_RANGES.map(range => (
          <Chip
            key={range}
            label={range}
            selected={budget === range}
            onPress={() => setBudget(range)}
          />
        ))}
      </View>

      <Text style={styles.label}>Fréquence des voyages 🗓️</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : 1 fois/an, 2 fois/an..."
        value={frequency}
        onChangeText={setFrequency}
      />
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Contraintes & Besoins Spécifiques</Text>

      <Text style={styles.label}>Allergies ou régimes alimentaires ? 🥦🚫</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : Allergie aux arachides"
        value={allergies}
        onChangeText={setAllergies}
      />

      <Text style={styles.label}>Autres contraintes / Infos médicales 🏥</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : Accessibilité poussette"
        value={constraints}
        onChangeText={setConstraints}
      />
    </ScrollView>
  );

  const renderStep4 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Activités préférées</Text>

      <View style={styles.chipContainer}>
        {ACTIVITIES.map(activity => (
          <Chip
            key={activity}
            label={activity}
            selected={selectedActivities.includes(activity)}
            onPress={() => toggleActivity(activity)}
          />
        ))}
      </View>
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${(currentStep / 4) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>Étape {currentStep}/4</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}

      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity 
            style={[styles.button, styles.previousButton]} 
            onPress={handlePrevious}
          >
            <Text style={styles.buttonText}>Précédent</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.button, styles.nextButton]} 
          onPress={currentStep === 4 ? handleFinish : handleNext}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {currentStep === 4 ? 'Terminer' : 'Suivant'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  progressContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  progress: {
    height: '100%',
    backgroundColor: '#0f8066',
    borderRadius: 2,
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  stepContainer: {
    flex: 1,
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    margin: 20,
    borderRadius: 8,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  previousButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  nextButton: {
    backgroundColor: '#0f8066',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
