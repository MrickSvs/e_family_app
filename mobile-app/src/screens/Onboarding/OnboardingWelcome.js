import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function OnboardingWelcome() {
  const navigation = useNavigation();
  const [familyName, setFamilyName] = useState("");

  const handleStart = () => {
    if (familyName.length < 2) {
      Alert.alert("Nom invalide", "Merci de renseigner un nom de famille valide.");
      return;
    }
    navigation.navigate("Step1Adults", { familyName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comment s'appelle votre famille ?</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : Martin"
        value={familyName}
        onChangeText={setFamilyName}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleStart}>
          <Text style={styles.nextButtonText}>Commencer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginVertical: 10 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 20,
  },
  buttonContainer: {
    width: "80%",
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: "#0f8066",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },
  nextButtonText: { color: "#fff", fontSize: 16, textAlign: "center" },
});