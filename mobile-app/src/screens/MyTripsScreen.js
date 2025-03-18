import React from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  StyleSheet 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function MyTripsScreen() {
  const navigation = useNavigation();

  // Exemple de données (à remplacer par des vraies données)
  const upcomingTrips = [
    {
      id: 1,
      title: "Road Trip Californie",
      date: "15-30 Juillet 2024",
      imageUrl: "https://static1.evcdn.net/cdn-cgi/image/width=1200,height=514,quality=70,fit=crop/offer/raw/2022/08/30/6e606193-8d44-4391-987d-a2b82e52cbde.jpg",
      progress: 60,
      description: "Un voyage inoubliable sur la côte ouest des États-Unis",
      duration: "15 jours",
      type: "Road Trip en famille",
      price: "4500€ / personne",
      priceDetails: "Vol + Hébergement + Location voiture",
      tags: ["Nature", "Plage", "Ville", "Culture"],
      itinerary: [
        { day: 1, title: "Los Angeles", description: "Arrivée et installation" },
        { day: 2, title: "Santa Monica", description: "Plage et Pier" }
      ],
      practicalInfo: {
        difficulty: "Facile",
        transport: "Location de voiture",
        accommodation: "Hôtels 3-4*",
        meals: "Petits déjeuners inclus",
        included: ["Vols", "Hôtels", "Location voiture"],
        notIncluded: ["Repas", "Activités", "Essence"]
      }
    },
  ];

  const pastTrips = [
    {
      id: 3,
      title: "Découverte du Japon",
      date: "Avril 2023",
      imageUrl: "https://www.japan-experience.com/sites/default/files/styles/scale_crop_880x460/public/legacy/japan_experience/content/images/voyager-au-japon-en-famille.jpg",
      rating: 5,
      description: "Un voyage culturel au pays du soleil levant",
      duration: "12 jours",
      type: "Circuit culturel",
      gallery: [
        "https://www.japan-experience.com/sites/default/files/styles/scale_crop_880x460/public/legacy/japan_experience/content/images/voyager-au-japon-en-famille.jpg",
        "https://www.japan-guide.com/g18/627_01.jpg"
      ],
      highlights: ["Tokyo", "Kyoto", "Mont Fuji"],
      memories: [
        { id: 1, title: "Temple d'or", description: "Visite magique au coucher du soleil" },
        { id: 2, title: "Repas traditionnel", description: "Dégustation de sushis en famille" }
      ]
    },
    {
      id: 4,
      title: "Safari Kenya",
      date: "Août 2023",
      imageUrl: "https://www.kenya-guide.com/images/family-safari-1200.jpg",
      rating: 4,
      description: "Une aventure sauvage en famille",
      duration: "10 jours",
      type: "Safari",
      gallery: [
        "https://www.kenya-guide.com/images/family-safari-1200.jpg",
        "https://www.naturaltoursandsafaris.com/images/kenya-family-safari.jpg"
      ],
      highlights: ["Masai Mara", "Lac Nakuru", "Amboseli"],
      memories: [
        { id: 1, title: "Lions", description: "Observation d'une famille de lions" },
        { id: 2, title: "Village Masai", description: "Rencontre avec les locaux" }
      ]
    }
  ];

  const navigateToTripDetail = (trip, isPast = false) => {
    navigation.navigate(isPast ? "PastTripDetail" : "UpcomingTripDetail", { trip });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.mainTitle}>Mes Voyages</Text>
          <Text style={styles.subtitle}>Gérer mes voyages passés et à venir</Text>
        </View>

        {/* Section : Voyages à venir */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voyages à venir</Text>
          {upcomingTrips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              style={styles.tripCard}
              onPress={() => navigateToTripDetail(trip)}
            >
              <Image source={{ uri: trip.imageUrl }} style={styles.tripImage} />
              <View style={styles.tripInfo}>
                <Text style={styles.tripTitle}>{trip.title}</Text>
                <Text style={styles.tripDate}>{trip.date}</Text>
                {/* Barre de progression */}
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { width: `${trip.progress}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  Préparation : {trip.progress}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section : Voyages passés */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voyages passés</Text>
          {pastTrips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              style={styles.tripCard}
              onPress={() => navigateToTripDetail(trip, true)}
            >
              <Image source={{ uri: trip.imageUrl }} style={styles.tripImage} />
              <View style={styles.tripInfo}>
                <Text style={styles.tripTitle}>{trip.title}</Text>
                <Text style={styles.tripDate}>{trip.date}</Text>
                {/* Affichage du rating */}
                <View style={styles.ratingContainer}>
                  {[...Array(5)].map((_, i) => (
                    <Text key={i} style={styles.ratingStar}>
                      {i < trip.rating ? "★" : "☆"}
                    </Text>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#F7F5ED",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  tripCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tripInfo: {
    padding: 12,
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  tripDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  progressContainer: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#0f8066",
  },
  progressText: {
    fontSize: 12,
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  ratingStar: {
    color: "#ffd700",
    fontSize: 16,
    marginRight: 2,
  },
});
