import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Step3ChildrenAges() {
  const navigation = useNavigation();
  const route = useRoute();
  const { children } = route.params;
  const initialAges = Array(children).fill("");
  const [ages, setAges] = useState(initialAges);

  const handleNext = () => {
    navigation.navigate("Step4TravelType", { ...route.params, ages });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Âges des enfants</Text>
      {children === 0 ? (
        <Text style={{ marginVertical: 20 }}>Aucun enfant</Text>
      ) : (
        ages.map((age, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`Enfant ${index + 1}`}
            keyboardType="numeric"
            value={age}
            onChangeText={(val) => {
              const newAges = [...ages];
              newAges[index] = val;
              setAges(newAges);
            }}
          />
        ))
      )}


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
  input: { width: "80%", padding: 10, marginBottom: 10, borderBottomWidth: 1, textAlign: "center" },
  
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
