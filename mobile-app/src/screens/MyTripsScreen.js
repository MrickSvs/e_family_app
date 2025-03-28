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
      title: "Costa Rica en famille",
      date: "En cours",
      image_url: "https://static1.evcdn.net/cdn-cgi/image/width=1400,height=1050,quality=70,fit=crop/offer/raw/2022/08/03/6d2d255d-c122-4ef7-99ab-80624f563bb6.jpg",
      progress: 60,
      description: "Découverte du Costa Rica en famille : volcans, plages paradisiaques et forêts tropicales",
      duration: "10 jours",
      type: "Circuit nature et plage",
      price: "3200€ / personne",
      priceDetails: "Vol + Hébergement + Transport",
      tags: ["Nature", "Plage", "Famille", "Aventure"],
      gallery: [
        "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1", // Volcan Arenal
        "https://images.unsplash.com/photo-1589308454676-21b1aa8b8c1c", // Manuel Antonio
        "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5", // Plage Tamarindo
        "https://images.unsplash.com/photo-1518183261945-b0989cfb3723", // San José
        "https://images.unsplash.com/photo-1542736705-53f0131d1e98", // Forêt tropicale
        "https://images.unsplash.com/photo-1580094777767-4aa98f7e7696", // Parc national de Tortuguero
      ],
      itinerary: [
        { day: 1, title: "San José", description: "Arrivée et installation" },
        { day: 2, title: "Arenal", description: "Volcan et sources chaudes" },
        { day: 3, title: "Manuel Antonio", description: "Parc national et plage" },
        { day: 4, title: "Tamarindo", description: "Surf et détente" }
      ],
      practicalInfo: {
        difficulty: "Facile",
        transport: "Minibus privé",
        accommodation: "Hôtels 3-4*",
        meals: "Petits déjeuners inclus",
        included: ["Vols", "Hôtels", "Transferts", "Guide francophone"],
        notIncluded: ["Déjeuners", "Dîners", "Activités optionnelles"]
      }
    },
  ];

  const upcomingTrips = [
    {
      id: 2,
      title: "Séjour aux Maldives",
      date: "15-30 Août 2024",
      imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
      progress: 30,
      description: "Un paradis tropical pour toute la famille",
      duration: "10 jours",
      type: "Séjour balnéaire",
      price: "3500€ / personne",
      priceDetails: "Vol + Resort tout inclus",
      tags: ["Plage", "Luxe", "Relaxation", "Snorkeling"],
      gallery: [
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8", // Vue aérienne
        "https://images.unsplash.com/photo-1540202403-b7abd6747a18", // Villa sur pilotis
        "https://images.unsplash.com/photo-1583212292454-39d2a86a7921", // Snorkeling
        "https://images.unsplash.com/photo-1578922746465-3a80a228f223", // Coucher de soleil
      ],
    },
  ];

  const pendingQuotes = [
    {
      id: 3,
      title: "Circuit Vietnam",
      date: "En attente de devis",
      imageUrl: "https://images.unsplash.com/photo-1557750255-c76072a7aad1",
      description: "Découverte du Vietnam en famille",
      duration: "14 jours",
      type: "Circuit culturel",
      status: "En cours de préparation",
      tags: ["Culture", "Gastronomie", "Histoire", "Nature"],
      gallery: [
        "https://images.unsplash.com/photo-1557750255-c76072a7aad1", // Baie d'Halong
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482", // Rizières
        "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b", // Hoi An
        "https://images.unsplash.com/photo-1555921015-5532091f6026", // Temple
      ],
    },
  ];

  const pastTrips = [
    {
      id: 4,
      title: "Découverte du Japon",
      date: "Avril 2023",
      image_url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
      rating: 5,
      description: "Un voyage culturel au pays du soleil levant",
      duration: "12 jours",
      type: "Circuit culturel",
      gallery: [
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e", // Temple de Kyoto
        "https://images.unsplash.com/photo-1528360983277-13d401cdc186", // Tokyo nuit
        "https://images.unsplash.com/photo-1545569341-9eb8b30979d9", // Mont Fuji
        "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d", // Jardin traditionnel
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26", // Rue traditionnelle
      ],
      highlights: ["Tokyo", "Kyoto", "Mont Fuji"],
      memories: [
        { 
          id: 1, 
          title: "Temple d'or", 
          description: "Visite magique au coucher du soleil",
          photos: [
            "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
            "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d"
          ]
        },
        { 
          id: 2, 
          title: "Repas traditionnel", 
          description: "Dégustation de sushis en famille",
          photos: [
            "https://images.unsplash.com/photo-1553621042-f6e147245754",
            "https://images.unsplash.com/photo-1579871494447-9811cf80d66c"
          ]
        }
      ]
    },
  ];

  const navigateToTripDetail = (trip, type) => {
    console.log('Tentative de navigation vers le détail du voyage:', { type, tripId: trip.id, title: trip.title });
    const params = { trip };
    try {
      switch(type) {
        case 'current':
          console.log('Navigation vers CurrentTripDetail avec params:', params);
          navigation.navigate('CurrentTripDetail', params);
          break;
        case 'upcoming':
          console.log('Navigation vers UpcomingTripDetail avec params:', params);
          navigation.navigate('UpcomingTripDetail', params);
          break;
        case 'pending':
          console.log('Navigation vers PendingQuoteDetail avec params:', params);
          navigation.navigate('PendingQuoteDetail', params);
          break;
        case 'past':
          console.log('Navigation vers PastTripDetail avec params:', params);
          navigation.navigate('PastTripDetail', params);
          break;
      }
    } catch (error) {
      console.error('Erreur lors de la navigation:', error);
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
        <Image source={{ uri: trip.image_url }} style={styles.tripImage} />
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
