// src/screens/PastTripDetailScreen.js

import React from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  StyleSheet 
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Navbar from "../components/Navbar";

export default function PastTripDetailScreen() {
  const route = useRoute();
  const { tripId, title, date, imageUrl } = route.params || {};

  // Exemples de photos souvenirs
  const memories = [
    { id: 1, name: "Photo1.jpg", uri: "https://static1.evcdn.net/cdn-cgi/image/width=1200,height=514,quality=70,fit=crop/offer/raw/2022/08/30/6e606193-8d44-4391-987d-a2b82e52cbde.jpg" },
    { id: 2, name: "Photo2.jpg", uri: "https://thumbs.dreamstime.com/b/selfie-de-famille-en-montagne-131317379.jpg" },  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Bannière */}
        <View style={styles.banner}>
          <Image source={{ uri: imageUrl }} style={styles.bannerImage} />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>{title}</Text>
            <Text style={styles.bannerDates}>{date}</Text>
          </View>
        </View>

        {/* Récap voyage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Récapitulatif du voyage</Text>
          <Text style={styles.infoText}>
            Vous êtes partis {date} pour découvrir la magnifique région...
            {"\n"}{"\n"}
            Ce voyage a duré 10 jours, avec un itinéraire intense :
            {"\n"}• Jour 1 : Arrivée, installation{"\n"}• Jour 2 : Visite du parc X{"\n"}...
          </Text>
        </View>

        {/* Photos souvenirs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos souvenirs</Text>
          <View style={styles.memoriesContainer}>
            {memories.map((mem) => (
              <Image key={mem.id} source={{ uri: mem.uri }} style={styles.memoryImage} />
            ))}
          </View>
        </View>

        {/* Avis / Retours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Votre retour d'expérience</Text>
          <Text style={styles.infoText}>
            Merci d’avoir voyagé avec nous ! Laissez-nous un avis pour aider d’autres familles.
          </Text>
          {/* Ici tu pourras ajouter un composant de rating ou un bouton redirigeant vers un formulaire */}
        </View>
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
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },

  // Photos souvenirs
  memoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  memoryImage: {
    width: 120,
    height: 80,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
});
