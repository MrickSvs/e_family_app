import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const OnboardingFamilyInfo = () => {
  const navigation = useNavigation();
  const [numAdults, setNumAdults] = useState("");
  const [numChildren, setNumChildren] = useState("");
  const [childrenAges, setChildrenAges] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parlez-nous de votre famille</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nombre d'adultes"
        keyboardType="numeric"
        value={numAdults}
        onChangeText={setNumAdults}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Nombre d'enfants"
        keyboardType="numeric"
        value={numChildren}
        onChangeText={setNumChildren}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Âges des enfants (ex: 5, 8)"
        value={childrenAges}
        onChangeText={setChildrenAges}
      />

      <Button
        title="Continuer"
        onPress={() => navigation.navigate("Summary", {
          numAdults,
          numChildren,
          childrenAges
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { width: "80%", padding: 10, marginBottom: 10, borderBottomWidth: 1, textAlign: "center" },
});

export default OnboardingFamilyInfo;
