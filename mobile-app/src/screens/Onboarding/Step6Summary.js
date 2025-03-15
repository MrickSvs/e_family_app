import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function Step6Summary() {
  const route = useRoute();
  const navigation = useNavigation();
  const { adults, children, ages, travelType, budget } = route.params;

  const handleSubmit = async () => {
    const dataToSend = { adults, children, ages, travelType, budget };
    console.log("Final data:", dataToSend);

    // Envoyer au backend
    const response = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (response.ok) {
      navigation.navigate("Home");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Récapitulatif</Text>
      <Text>Nombre d'adultes : {adults}</Text>
      <Text>Nombre d'enfants : {children}</Text>
      {children > 0 && <Text>Âges : {ages.join(", ")}</Text>}
      <Text>Type de voyage : {travelType}</Text>
      <Text>Budget : {budget}</Text>
      <Button title="Valider" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
