import React, { useState } from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StyleSheet
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AgencyBlock from "../components/AgencyBlock";

export default function CurrentTripDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { trip } = route.params || {};

  // Exemple de données pour le voyage en cours
  const [currentLocation] = useState({
    name: "Santa Monica",
    nextStop: "Venice Beach",
    weather: "25°C - Ensoleillé",
    localTime: "14:30"
  });

  // Exemple de documents importants pour le voyage en cours
  const [importantDocs] = useState([
    { id: 1, name: "Assurance voyage.pdf", type: "insurance" },
    { id: 2, name: "Location voiture.pdf", type: "car" },
    { id: 3, name: "Réservations hôtels.pdf", type: "hotel" },
  ]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Bannière */}
        <View style={styles.banner}>
          <Image source={{ uri: trip.imageUrl }} style={styles.bannerImage} />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>{trip.title}</Text>
            <Text style={styles.bannerDates}>{trip.date}</Text>
          </View>
        </View>

        {/* Section : Localisation actuelle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Où êtes-vous ?</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <Ionicons name="location" size={24} color="#0f8066" />
              <Text style={styles.locationName}>{currentLocation.name}</Text>
            </View>
            <View style={styles.locationDetails}>
              <Text style={styles.locationDetailText}>
                Prochaine étape : {currentLocation.nextStop}
              </Text>
              <Text style={styles.locationDetailText}>
                Météo : {currentLocation.weather}
              </Text>
              <Text style={styles.locationDetailText}>
                Heure locale : {currentLocation.localTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Section : Documents importants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents importants</Text>
          {importantDocs.map((doc) => (
            <TouchableOpacity key={doc.id} style={styles.docCard}>
              <Ionicons 
                name={doc.type === "insurance" ? "shield-checkmark-outline" : 
                      doc.type === "car" ? "car-outline" : "bed-outline"} 
                size={24} 
                color="#0f8066" 
              />
              <Text style={styles.docName}>{doc.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section : Itinéraire du jour */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Programme du jour</Text>
          <View style={styles.itineraryCard}>
            <Text style={styles.itineraryText}>
              • 10:00 - Visite de Santa Monica Pier{"\n"}
              • 12:30 - Déjeuner au restaurant local{"\n"}
              • 14:00 - Temps libre sur la plage{"\n"}
              • 16:00 - Route vers Venice Beach{"\n"}
              • 18:00 - Dîner et soirée
            </Text>
          </View>
        </View>

        {/* Section : Contacts d'urgence */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacts d'urgence</Text>
          <TouchableOpacity style={styles.emergencyButton}>
            <Ionicons name="call-outline" size={24} color="#fff" />
            <Text style={styles.emergencyButtonText}>Appeler l'agence locale</Text>
          </TouchableOpacity>
        </View>

        <AgencyBlock 
          agency={{
            name: "L'agence de Virginie",
            imageUrl: "https://static1.evcdn.net/images/reduction/1649071_w-768_h-1024_q-70_m-crop.jpg",
            rating: 4.5,
            reviewCount: 75,
            tags: ["Famille avec enfants", "Incontournables"],
            memberSince: "1 an",
            experience: "3 ans",
            languages: ["Espagnol", "Français"],
            location: "Espagne"
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  banner: {
    backgroundColor: "#F7F5ED",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  bannerImage: {
    width: "100%",
    height: 180,
  },
  bannerTextContainer: {
    padding: 16,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  bannerDates: {
    fontSize: 14,
    color: "#555",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  locationCard: {
    backgroundColor: "#F7F5ED",
    borderRadius: 8,
    padding: 16,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  locationDetails: {
    gap: 8,
  },
  locationDetailText: {
    fontSize: 14,
    color: "#666",
  },
  docCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F5ED",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  docName: {
    fontSize: 14,
    color: "#333",
    marginLeft: 12,
  },
  itineraryCard: {
    backgroundColor: "#F7F5ED",
    borderRadius: 8,
    padding: 16,
  },
  itineraryText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 24,
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 8,
  },
  emergencyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
}); 