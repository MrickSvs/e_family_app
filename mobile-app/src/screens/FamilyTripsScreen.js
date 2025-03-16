import React from "react";
import { SafeAreaView, View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import Navbar from "../components/Navbar";

export default function FamilyTripsScreen() {
  const route = useRoute();

  const { familyName, adults, children, ages, travelType, budget } = route.params || {};

  const trips = [
    {
      id: 1,
      title: "Costa Rica en famille",
      duration: "10 jours",
      type: "Nature & découverte",
      description:
        "Idéal pour les jeunes enfants grâce aux courtes distances et hébergements confortables.",
      imageUrl: "https://www.tracedirecte.com/media/original_images/parc-national-manuel-antonio-costa-rica.jpg.1920x0_q85_format-jpg.jpg",
      tags: ["Parfait avec bébé", "Coup de cœur familles"],
    },
    {
      id: 2,
      title: "Italie : Douceur Toscane",
      duration: "7 jours",
      type: "Culture & détente",
      description:
        "Un rythme adapté, des découvertes culturelles et une gastronomie accessible à tous.",
      imageUrl: "https://media.routard.com/image/17/9/fb-meilleur-toscane.1495179.jpg",
      tags: ["Facile avec enfants en bas âge"],
    },
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* En-tête colorée */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voyages sélectionnés</Text>
        <Text style={styles.headerSubtitle}>pour la famille {familyName}</Text>
      </View>

      {/* Informations sur la famille */}
      <View style={styles.infoContainer}>
      <Text style={styles.infoText}>
  {adults} adulte{adults > 1 ? "s" : ""}, {children} enfant
  {children > 1 ? "s" : ""} ({Array.isArray(ages) ? ages.join(", ") : "Âge non spécifié"} ans)
</Text>

        <Text style={styles.infoText}>
          Type de voyage : {travelType} · Budget : {budget}
        </Text>
      </View>

      {/* Liste des voyages */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {trips.map((trip) => (
          <View key={trip.id} style={styles.card}>
            <Image source={{ uri: trip.imageUrl }} style={styles.image} />
            <Text style={styles.cardTitle}>{trip.title}</Text>
            <Text style={styles.cardInfo}>
              {trip.duration} · {trip.type}
            </Text>
            <Text style={styles.cardDescription}>{trip.description}</Text>
            <View style={styles.tagContainer}>
              {trip.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaText}>Découvrir ce voyage</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  /* HEADER */
  header: {
    backgroundColor: "#0f8066",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 18,
    color: "#fff",
  },
  /* INFOS FAMILLE */
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  /* SCROLLVIEW */
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  /* CARTE VOYAGE */
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 20,
    padding: 15,

    // Ombre iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Ombre Android
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  cardInfo: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  cardDescription: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  tag: {
    backgroundColor: "#e2f4f0",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 12,
    color: "#0f8066",
    fontWeight: "600",
  },
  ctaButton: {
    backgroundColor: "#0f8066",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  ctaText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
