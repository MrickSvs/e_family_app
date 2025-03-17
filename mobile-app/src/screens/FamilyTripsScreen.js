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
      imageUrl:
        "https://www.tracedirecte.com/media/original_images/parc-national-manuel-antonio-costa-rica.jpg.1920x0_q85_format-jpg.jpg",
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
    {
      id: 3,
      title: "Safarique Afrique du Sud en famille",
      duration: "14 jours",
      type: "Aventure & culture",
      description:
        "Partez en safari pour observer les Big Five dans le parc national Kruger, puis découvrez la culture locale dans les villages traditionnels. Des lodges adaptés aux familles offrent des programmes spécifiques pour les enfants, rendant l'expérience à la fois sûre et éducative.",
      imageUrl: "https://www.leslouves.com/wp-content/uploads/2017/10/12-Poesy-by-Sophie.jpg",
      tags: ["Safari", "Faune", "Pour toute la famille"],
    },
    {
      id: 4,
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
      {/* Header minimal et épuré */}
      <View style={styles.topContainer}>
        <Text style={styles.mainTitle}>Voyages sélectionnés</Text>
        <Text style={styles.subtitle}>
          Famille {familyName} • {adults} adulte{adults > 1 ? "s" : ""}, {children} enfant
          {children > 1 ? "s" : ""} ({Array.isArray(ages) ? ages.join(", ") : "?"} ans)
        </Text>
        <Text style={styles.familyInfo}>
          Type de voyage : {travelType} • Budget : {budget}
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

  /* PARTIE HAUTE */
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
    marginBottom: 4,
  },
  familyInfo: {
    fontSize: 13,
    color: "#666",
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
    marginBottom: 12,
    padding: 12,

    // Ombre iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 3,

    // Ombre Android
    elevation: 1,
  },
  image: {
    width: "100%",
    height: 140, // Hauteur réduite pour afficher 2 cartes sans scroller
    borderRadius: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    color: "#333",
  },
  cardInfo: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  cardDescription: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tag: {
    backgroundColor: "#e2f4f0",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 11,
    color: "#0f8066",
    fontWeight: "600",
  },
  ctaButton: {
    backgroundColor: "#0f8066",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  ctaText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
