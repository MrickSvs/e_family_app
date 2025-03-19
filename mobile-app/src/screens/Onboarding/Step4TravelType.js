import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const travelOptions = ["Découverte", "Aventure", "Détente", "Culture"];

export default function Step4TravelType() {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedTypes, setSelectedTypes] = useState([]); // Tableau pour la sélection multiple

  const toggleSelection = (option) => {
    setSelectedTypes((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option) // Supprime si déjà sélectionné
        : [...prev, option] // Ajoute si pas encore sélectionné
    );
  };

  const handleNext = () => {
    if (selectedTypes.length === 0) {
      Alert.alert(
        "Sélection requise",
        "Veuillez sélectionner au moins un type de voyage",
        [{ text: "OK" }]
      );
      return;
    }
    navigation.navigate("Step5Budget", { ...route.params, travelType: selectedTypes });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌍 Quels types de voyage préférez-vous ?</Text>
      <Text style={styles.subtitle}>Sélectionnez au moins une option</Text>

      <View style={styles.optionsContainer}>
        {travelOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.optionButton, selectedTypes.includes(option) && styles.optionSelected]}
            onPress={() => toggleSelection(option)}
          >
            <Text style={[styles.optionText, selectedTypes.includes(option) && styles.optionTextSelected]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.nextButton, selectedTypes.length === 0 && styles.nextButtonDisabled]} 
          onPress={handleNext}
          disabled={selectedTypes.length === 0}
        >
          <Text style={styles.nextButtonText}>Continuer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginVertical: 20 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20 },
  optionsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginVertical: 20 },
  optionButton: { backgroundColor: "#ededed", margin: 5, padding: 15, borderRadius: 8 },
  optionSelected: { backgroundColor: "#0f8066" },
  optionText: { fontSize: 16 },
  optionTextSelected: { color: "#fff" },
  
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },

  backButton: {
    backgroundColor: "#0f8066",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  backButtonText: { color: "#fff", fontSize: 16, textAlign: "center"}, 
  
  nextButton: {
    backgroundColor: "#0f8066",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center", 
  },
  nextButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  nextButtonText: { color: "#fff", fontSize: 16, textAlign: "center"}
});
