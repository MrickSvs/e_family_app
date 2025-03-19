import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const budgetOptions = [
  { label: "Économique", price: "jusqu'à 1000€" },
  { label: "Modéré", price: "1000€ - 3000€" },
  { label: "Confort", price: "3000€ - 5000€" },
  { label: "Luxe", price: "5000€ et plus" }
];

export default function Step5Budget() {
  const navigation = useNavigation();
  const route = useRoute();
  const [budget, setBudget] = useState("Modéré");

  const handleNext = () => {
    navigation.navigate("Step6Summary", { ...route.params, budget });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Quel est votre budget moyen ?</Text>
      <Text style={styles.subtitle}>Sélectionnez une option qui correspond à votre budget par personne</Text>

      <View style={styles.optionsContainer}>
        {budgetOptions.map((option) => (
          <TouchableOpacity
            key={option.label}
            style={[styles.optionButton, budget === option.label && styles.optionSelected]}
            onPress={() => setBudget(option.label)}
          >
            <Text style={[styles.optionLabel, budget === option.label && styles.optionTextSelected]}>
              {option.label}
            </Text>
            <Text style={[styles.optionPrice, budget === option.label && styles.optionTextSelected]}>
              {option.price}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Continuer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginVertical: 20 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20, textAlign: "center" },
  optionsContainer: { width: "100%", marginVertical: 20 },
  optionButton: { 
    backgroundColor: "#ededed", 
    marginVertical: 8, 
    padding: 15, 
    borderRadius: 8,
    alignItems: "center"
  },
  optionSelected: { backgroundColor: "#0f8066" },
  optionLabel: { 
    fontSize: 18, 
    fontWeight: "bold",
    marginBottom: 4
  },
  optionPrice: { 
    fontSize: 14,
    color: "#666"
  },
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
  nextButtonText: { color: "#fff", fontSize: 16, textAlign: "center"}
});
