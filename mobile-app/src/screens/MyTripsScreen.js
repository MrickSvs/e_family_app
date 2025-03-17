import React from "react";
import { SafeAreaView, View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import Navbar from "../components/Navbar";
import { useNavigation } from "@react-navigation/native";

export default function MyTripsScreen() {
    const navigation = useNavigation();
  // Exemple de voyage à venir
  const upcomingTrip = {
    id: 1,
    title: "Roadtrip familiale en Californie",
    date: "Du 12 au 22 août 2025",
    imageUrl: "https://www.voyagesetenfants.com/wp-content/uploads/2024/03/image-21.png",
    status: "À venir",
  };

  // Exemple de voyage passé
  const pastTrip = {
    id: 2,
    title: "Découverte du Canada en famille",
    date: "Du 3 au 14 janvier 2024",
    imageUrl: "https://static1.evcdn.net/cdn-cgi/image/width=1400,height=1050,quality=70,fit=crop/offer/raw/2023/09/12/5b060a89-4777-4da1-9d6c-7e6e0caac0fd.jpg",
    status: "Terminé",
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* En-tête similaire */}
      <View style={styles.topContainer}>
        <Text style={styles.mainTitle}>Mes Voyages</Text>
        <Text style={styles.subtitle}>Gérez vos voyages à venir et passés</Text>
      </View>

      {/* Contenu défilable */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Section Voyage à venir */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Voyage à venir</Text>
          <View style={styles.card}>
            <Image source={{ uri: upcomingTrip.imageUrl }} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{upcomingTrip.title}</Text>
              <Text style={styles.cardDate}>{upcomingTrip.date}</Text>
              <TouchableOpacity style={styles.ctaButton}
  onPress={() => navigation.navigate("UpcomingTripDetail", {
    tripId: upcomingTrip.id,
    title: upcomingTrip.title,
    date: upcomingTrip.date,
    imageUrl: upcomingTrip.imageUrl,
  })}
>
  <Text style={styles.ctaText}>Voir les détails</Text>
</TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Section Voyage passé */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Voyage passé</Text>
          <View style={styles.card}>
            <Image source={{ uri: pastTrip.imageUrl }} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{pastTrip.title}</Text>
              <Text style={styles.cardDate}>{pastTrip.date}</Text>
              <TouchableOpacity style={styles.ctaButton}
  onPress={() => navigation.navigate("PastTripDetail", {
    tripId: pastTrip.id,
    title: pastTrip.title,
    date: pastTrip.date,
    imageUrl: pastTrip.imageUrl,
  })}
>
  <Text style={styles.ctaText}>Voir le résumé</Text>
</TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Barre de navigation */}
      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    // Ombre iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    // Ombre Android
    elevation: 1,
    flexDirection: "row",
    overflow: "hidden",
  },
  image: {
    width: 120,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardDate: {
    fontSize: 14,
    color: "#888",
    marginVertical: 4,
  },
  ctaButton: {
    backgroundColor: "#0f8066",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 6,
    alignSelf: "flex-start",
  },
  ctaText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
