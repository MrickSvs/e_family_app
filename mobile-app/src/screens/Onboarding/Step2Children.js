import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Step2Children() {
  const navigation = useNavigation();
  const route = useRoute();
  const [children, setChildren] = useState(1);

  const handleNext = () => {
    navigation.navigate("Step3ChildrenAges", { ...route.params, children });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Combien d'enfants ?</Text>

      <View style={styles.optionsContainer}>
        {[0, 1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity
            key={num}
            style={[styles.optionButton, children === num && styles.optionSelected]}
            onPress={() => setChildren(num)}
          >
            <Text style={[styles.optionText, children === num && styles.optionTextSelected]}>{num}</Text>
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
  
    optionsContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 20 },
    optionButton: { backgroundColor: "#ededed", margin: 5, padding: 15, borderRadius: 8 },
    optionSelected: { backgroundColor: "#0f8066" },
    optionText: { fontSize: 18 },
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