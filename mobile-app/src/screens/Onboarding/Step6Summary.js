import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { saveOnboardingData } from "../../services/onboardingService";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fonction pour générer un UUID valide
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function Step6Summary() {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    familyName = "Famille",
    adults = 1,
    children = 0,
    ages = [],
    travelType = "Non spécifié",
    budget = "Non spécifié",
  } = route.params || {};

  const handleSubmit = async () => {
    try {
      // Générer un UUID valide
      const deviceId = generateUUID();
      await AsyncStorage.setItem('deviceId', deviceId);

      const familyData = {
        device_id: deviceId,
        family_name: familyName,
        members: [
          ...Array(adults).fill().map((_, i) => ({
            first_name: `Adulte ${i + 1}`,
            last_name: familyName,
            role: "Adulte"
          })),
          ...Array(children).fill().map((_, i) => ({
            first_name: `Enfant ${i + 1}`,
            last_name: familyName,
            role: "Enfant",
            birth_date: ages[i] ? `20${24 - ages[i]}-01-01` : null
          }))
        ],
        travel_preferences: {
          travel_type: travelType,
          budget: budget
        }
      };

      const response = await saveOnboardingData(familyData);

      if (response.success) {
        // Sauvegarder les préférences de voyage localement
        await AsyncStorage.setItem('familyPreferences', JSON.stringify({
          travel_type: travelType,
          budget: budget
        }));

        navigation.reset({
          index: 0,
          routes: [{ name: "Main", params: { screen: "FamilyTripsScreen" } }],
        });
      } else {
        Alert.alert("Erreur", response.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'onboarding:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de l'enregistrement des données.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Famille {familyName}</Text>
      <View style={styles.summaryItem}>
        <Text style={styles.label}>Adultes :</Text>
        <Text style={styles.value}>{adults}</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.label}>Enfants :</Text>
        <Text style={styles.value}>{children}</Text>
      </View>
      {children > 0 && (
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Âges des enfants :</Text>
          <Text style={styles.value}>{ages.length ? ages.join(", ") : "Non précisé"}</Text>
        </View>
      )}
      <View style={styles.summaryItem}>
        <Text style={styles.label}>Type de voyage :</Text>
        <Text style={styles.value}>{travelType}</Text>
      </View>
      <View style={styles.summaryItem}>
        <Text style={styles.label}>Budget :</Text>
        <Text style={styles.value}>{budget}</Text>
      </View>

      <TouchableOpacity style={styles.validateButton} onPress={handleSubmit}>
        <Text style={styles.validateButtonText}>Découvrir mon prochain voyage</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
  },
  label: { fontSize: 18, color: "#555" },
  value: { fontSize: 18, fontWeight: "bold", color: "#333" },
  validateButton: { backgroundColor: "#0f8066", paddingVertical: 15, borderRadius: 8, marginTop: 30, alignItems: "center" },
  validateButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
