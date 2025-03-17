import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { saveOnboardingData } from "../../services/onboardingService";

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
    const familyData = {
      user_id: 1, // Remplace par l'ID réel de l'utilisateur
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
          birth_date: ages[i] ? `20${24 - ages[i]}-01-01` : null // Estimation année de naissance
        }))
      ],
      travel_preferences: {
        travel_type: travelType,
        budget: budget
      }
    };

    const response = await saveOnboardingData(familyData);

    if (response.success) {
        navigation.navigate("Main", {
            screen: "FamilyTripsScreen",
            params: {
              familyName,
              adults,
              children,
              ages,
              travelType,
              budget,
            },
          });
    } else {
      Alert.alert("Erreur", response.message);
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
