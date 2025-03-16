import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Step1Adults() {
  const navigation = useNavigation();
  const route = useRoute();
  const [adults, setAdults] = useState(2);

  const handleNext = () => {
    navigation.navigate("Step2Children", { 
      ...route.params,  // ⬅️ Important pour transmettre le familyName
      adults 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Combien d'adultes voyagent ?</Text>

      <View style={styles.optionsContainer}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity
            key={num}
            style={[styles.optionButton, adults === num && styles.optionSelected]}
            onPress={() => setAdults(num)}
          >
            <Text style={[styles.optionText, adults === num && styles.optionTextSelected]}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Continuer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginVertical: 20 },
  optionsContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 20 },
  optionButton: { backgroundColor: "#ededed", margin: 5, padding: 15, borderRadius: 8 },
  optionSelected: { backgroundColor: "#0f8066" },
  optionText: { fontSize: 18 },
  optionTextSelected: { color: "#fff" },
  nextButton: { backgroundColor: "#0f8066", paddingHorizontal: 25, paddingVertical: 10, borderRadius: 8, marginTop: 20 },
  nextButtonText: { color: "#fff", fontSize: 16 },
});
