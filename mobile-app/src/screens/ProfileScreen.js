import React from "react";
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* En-tête similaire à FamilyTripsScreen */}
      <View style={styles.topContainer}>
        <Text style={styles.mainTitle}>Mon Profil</Text>
        <Text style={styles.subtitle}>Gérer mes informations familiales</Text>
      </View>

      {/* Contenu principal */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileSection}>
          <Text style={styles.profileTitle}>Profil famille</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate("FamilyProfile")}
          >
            <Text style={styles.ctaButtonText}>Compléter mon profil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  /* Partie haute similaire à FamilyTripsScreen */
  topContainer: {
    backgroundColor: "#F7F5ED",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
  },

  /* Contenu déroulant */
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  /* Section Profil */
  profileSection: {
    marginTop: 20,
    alignItems: "center",
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  ctaButton: {
    backgroundColor: "#0f8066",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});