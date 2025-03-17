import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Ou la lib d'icônes que tu utilises

export default function FamilyProfileScreen() {
  const navigation = useNavigation();

  // Étapes du formulaire (1 à 4)
  const [currentStep, setCurrentStep] = useState(1);

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
  const [dreamDestinations, setDreamDestinations] = useState('');

  // Calcul de la progression pour la barre (en pourcentage)
  const progress = (currentStep / 4) * 100;

  // Fonctions de navigation entre étapes
  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const goBack = () => {
    // Si on est à la 1ère étape, on ferme la page ; sinon on recule d’une étape
    if (currentStep === 1) {
      navigation.goBack();
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  };

  // Action finale (étape 4 -> Terminer)
  const handleFinish = () => {
    // Ici tu peux stocker / envoyer ces infos (AsyncStorage, Redux, API…)
    console.log('Profil familial complété :', {
      familyName,
      adults,
      children,
      ages,
      travelType,
      budget,
      frequency,
      allergies,
      constraints,
      dreamDestinations,
    });

    // Retourne au screen précédent (Profil) ou là où tu veux
    navigation.goBack();
  };

  // --- Rendu de chaque étape ---
  const renderStep1 = () => (
    <>
      <Text style={styles.stepTitle}>Informations Générales</Text>

      <Text style={styles.label}>Nom de la famille 🏡</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : Famille Martin"
        value={familyName}
        onChangeText={setFamilyName}
      />

      <Text style={styles.label}>Nombre d'adultes 🧑</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : 2"
        keyboardType="numeric"
        value={adults}
        onChangeText={setAdults}
      />

      <Text style={styles.label}>Nombre d'enfants 🧒</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : 1"
        keyboardType="numeric"
        value={children}
        onChangeText={setChildren}
      />

      <Text style={styles.label}>Âges des enfants 📅</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : 3, 7"
        value={ages}
        onChangeText={setAges}
      />
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.stepTitle}>Préférences de Voyage</Text>

      <Text style={styles.label}>Type de voyage préféré 🌍</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : Nature, Culture, Plage..."
        value={travelType}
        onChangeText={setTravelType}
      />

      <Text style={styles.label}>Budget moyen 💰</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : 1000-3000€"
        value={budget}
        onChangeText={setBudget}
      />

      <Text style={styles.label}>Fréquence des voyages 🗓️</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : 1 fois/an, 2 fois/an..."
        value={frequency}
        onChangeText={setFrequency}
      />
    </>
  );

  const renderStep3 = () => (
    <>
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
    </>
  );

  const renderStep4 = () => (
    <>
      <Text style={styles.stepTitle}>Destinations de Rêve</Text>

      <Text style={styles.label}>Quelles envies / destinations ? 🌅</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : Japon, Canada…"
        value={dreamDestinations}
        onChangeText={setDreamDestinations}
      />

      <View style={styles.finishContainer}>
        <Text style={styles.finishText}>
          Vous y êtes presque ! Validez pour enregistrer votre profil familial.
        </Text>
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.safeContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header : icône retour + barre de progression */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons
            name={currentStep === 1 ? 'close' : 'chevron-back'}
            size={24}
            color="#333"
          />
        </TouchableOpacity>
        
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        
        {/* Petit espace vide pour équilibrer */}
        <View style={{ width: 24 }} />
      </View>

      {/* Contenu de l’étape courante */}
      <View style={styles.container}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </View>

      {/* Footer : bouton "Suivant" ou "Terminer" */}
      <View style={styles.footer}>
        {currentStep < 4 ? (
          <TouchableOpacity style={styles.button} onPress={goNext}>
            <Text style={styles.buttonText}>Suivant</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleFinish}>
            <Text style={styles.buttonText}>Terminer</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F7F5ED',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#F7F5ED',
  },
  backButton: {
    paddingRight: 8,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#0f8066',
  },

  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 14,
  },

  finishContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  finishText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },

  footer: {
    padding: 20,
    backgroundColor: '#F7F5ED',
  },
  button: {
    backgroundColor: '#0f8066',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
