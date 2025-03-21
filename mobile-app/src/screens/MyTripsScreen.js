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
  const currentTrips = [
    {
      id: 1,
      title: "Road Trip Californie",
      date: "En cours",
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

  const upcomingTrips = [
    {
      id: 2,
      title: "Séjour aux Maldives",
      date: "15-30 Août 2024",
      imageUrl: "https://www.maldives.com/wp-content/uploads/2021/01/maldives-family-resorts.jpg",
      progress: 30,
      description: "Un paradis tropical pour toute la famille",
      duration: "10 jours",
      type: "Séjour balnéaire",
      price: "3500€ / personne",
      priceDetails: "Vol + Resort tout inclus",
      tags: ["Plage", "Luxe", "Relaxation", "Snorkeling"],
    },
  ];

  const pendingQuotes = [
    {
      id: 3,
      title: "Circuit Vietnam",
      date: "En attente de devis",
      imageUrl: "https://www.vietnam.travel/sites/default/files/2020-02/family-travel-vietnam.jpg",
      description: "Découverte du Vietnam en famille",
      duration: "14 jours",
      type: "Circuit culturel",
      status: "En cours de préparation",
      tags: ["Culture", "Gastronomie", "Histoire", "Nature"],
    },
  ];

  const pastTrips = [
    {
      id: 4,
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
  ];

  const navigateToTripDetail = (trip, type) => {
    const params = { trip };
    switch(type) {
      case 'current':
        navigation.navigate('CurrentTripDetail', params);
        break;
      case 'upcoming':
        navigation.navigate('UpcomingTripDetail', params);
        break;
      case 'pending':
        navigation.navigate('PendingQuoteDetail', params);
        break;
      case 'past':
        navigation.navigate('PastTripDetail', params);
        break;
    }
  };

  const renderTripCard = (trip, type) => {
    const isPending = type === 'pending';
    
    return (
      <TouchableOpacity
        key={trip.id}
        style={[styles.tripCard, isPending && styles.pendingCard]}
        onPress={() => navigateToTripDetail(trip, type)}
      >
        <Image source={{ uri: trip.imageUrl }} style={styles.tripImage} />
        <View style={styles.tripInfo}>
          <Text style={styles.tripTitle}>{trip.title}</Text>
          <Text style={styles.tripDate}>{trip.date}</Text>
          {!isPending && type !== 'past' && (
            <>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${trip.progress}%` }]} />
              </View>
              <Text style={styles.progressText}>
                Préparation : {trip.progress}%
              </Text>
            </>
          )}
          {type === 'past' && (
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, i) => (
                <Text key={i} style={styles.ratingStar}>
                  {i < trip.rating ? "★" : "☆"}
                </Text>
              ))}
            </View>
          )}
          {isPending && (
            <View style={styles.pendingStatus}>
              <Text style={styles.pendingStatusText}>{trip.status}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.mainTitle}>Mes Voyages</Text>
          <Text style={styles.subtitle}>Gérer tous mes voyages</Text>
        </View>

        {/* Section : Voyages en cours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voyages en cours</Text>
          {currentTrips.map((trip) => renderTripCard(trip, 'current'))}
        </View>

        {/* Section : Voyages à venir */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voyages à venir</Text>
          {upcomingTrips.map((trip) => renderTripCard(trip, 'upcoming'))}
        </View>

        {/* Section : Voyages en attente de devis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>En attente de devis</Text>
          {pendingQuotes.map((trip) => renderTripCard(trip, 'pending'))}
        </View>

        {/* Section : Voyages passés */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voyages passés</Text>
          {pastTrips.map((trip) => renderTripCard(trip, 'past'))}
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
  pendingCard: {
    borderWidth: 1,
    borderColor: "#FFA500",
    borderStyle: "dashed",
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
  pendingStatus: {
    backgroundColor: "#FFF3E0",
    padding: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  pendingStatusText: {
    color: "#FFA500",
    fontSize: 12,
    fontWeight: "500",
  },
});
