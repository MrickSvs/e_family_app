import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const OnboardingSummary = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(route.params),
    });
    if (response.ok) {
      navigation.navigate("Home");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Récapitulatif :</Text>
      <Text>Adultes : {route.params.numAdults}</Text>
      <Text>Enfants : {route.params.numChildren}</Text>
      <Text>Âges : {route.params.childrenAges}</Text>
      <Text>Type de voyage : {route.params.travelType}</Text>
      <Text>Budget : {route.params.budget}</Text>
      <Button title="Valider" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default OnboardingSummary;
