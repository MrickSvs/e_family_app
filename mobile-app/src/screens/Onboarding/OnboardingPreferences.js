import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";

const OnboardingPreferences = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [travelType, setTravelType] = useState("nature");
  const [budget, setBudget] = useState("1000-3000");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vos préférences de voyage</Text>

      {/* Type de voyage */}
      <Text style={styles.label}>Type de voyage préféré</Text>
      <Picker selectedValue={travelType} onValueChange={setTravelType} style={styles.picker}>
        <Picker.Item label="Aventure" value="adventure" />
        <Picker.Item label="Nature" value="nature" />
        <Picker.Item label="Culture" value="culture" />
        <Picker.Item label="Détente" value="relax" />
      </Picker>

      {/* Budget moyen */}
      <Text style={styles.label}>Budget moyen par voyage</Text>
      <Picker selectedValue={budget} onValueChange={setBudget} style={styles.picker}>
        <Picker.Item label="Moins de 1000€" value="<1000" />
        <Picker.Item label="1000-3000€" value="1000-3000" />
        <Picker.Item label="Plus de 3000€" value=">3000" />
      </Picker>

      <Button
        title="Continuer"
        onPress={() => navigation.navigate("Summary", {
          ...route.params,  // Récupère les infos précédentes
          travelType,
          budget
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, marginTop: 10 },
  picker: { height: 50, width: "80%", marginBottom: 20 }
});

export default OnboardingPreferences;
