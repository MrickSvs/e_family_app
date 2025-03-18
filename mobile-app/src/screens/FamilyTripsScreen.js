import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getFamilyInfo } from "../services/familyService";

export default function FamilyTripsScreen() {
  const navigation = useNavigation();
  const [familyData, setFamilyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFamilyData();
  }, []);

  const loadFamilyData = async () => {
    try {
      const data = await getFamilyInfo();
      setFamilyData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeContainer, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#0f8066" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safeContainer, styles.centerContainer]}>
        <Text style={styles.errorText}>Une erreur est survenue: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadFamilyData}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const trips = [
    {
      id: 1,
      title: "Costa Rica en famille",
      duration: "10 jours",
      type: "Nature & découverte",
      description:
        "Idéal pour les jeunes enfants grâce aux courtes distances et hébergements confortables.",
      imageUrl: "https://static1.evcdn.net/cdn-cgi/image/width=3840,height=2160,quality=70,fit=crop/offer/raw/2023/11/30/cbb4bd64-8c1d-44b7-9d51-c0847f5d8c80.jpg",
      tags: ["Parfait avec bébé", "Coup de cœur familles"],
      gallery: [
        "https://static1.evcdn.net/cdn-cgi/image/width=3840,height=2160,quality=70,fit=crop/offer/raw/2023/11/30/cbb4bd64-8c1d-44b7-9d51-c0847f5d8c80.jpg",
        "https://static1.evcdn.net/cdn-cgi/image/width=3840,height=2160,quality=70,fit=crop/offer/raw/2023/11/30/cbb4bd64-8c1d-44b7-9d51-c0847f5d8c80.jpg",
        "https://static1.evcdn.net/cdn-cgi/image/width=3840,height=2160,quality=70,fit=crop/offer/raw/2023/11/30/cbb4bd64-8c1d-44b7-9d51-c0847f5d8c80.jpg"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrivée à San José",
          description: "Accueil à l'aéroport et transfert vers votre hôtel. Temps libre pour vous installer et découvrir la capitale."
        },
        {
          day: 2,
          title: "Parc national Tortuguero",
          description: "Départ matinal pour le parc national Tortuguero. Croisière sur les canaux pour observer la faune locale."
        },
        {
          day: 3,
          title: "Plage et détente",
          description: "Journée de détente sur la plage avec activités adaptées aux enfants."
        }
      ],
      practicalInfo: {
        difficulty: "Facile",
        transport: "Inclus (minivan climatisé)",
        accommodation: "Hôtels 3-4 étoiles",
        meals: "Petit-déjeuner inclus",
        included: ["Guide francophone", "Transport", "Hébergement", "Activités mentionnées"],
        notIncluded: ["Vols internationaux", "Repas non mentionnés", "Dépenses personnelles"]
      },
      reviews: [
        {
          author: "Marie",
          rating: 5,
          date: "15/02/2024",
          text: "Un voyage parfait pour notre famille avec deux enfants en bas âge. Les distances sont courtes et les activités bien adaptées."
        },
        {
          author: "Thomas",
          rating: 4,
          date: "10/01/2024",
          text: "Très beau voyage, les enfants ont adoré voir les animaux. Les hébergements sont confortables."
        }
      ],
      price: "À partir de 2 490€",
      priceDetails: "Prix par personne, base double"
    },
    {
      id: 2,
      title: "Thaïlande, rencontres ethniques avec vos ados",
      duration: "7 jours",
      type: "Exploration",
      description:
        "Partez visiter les montagnes du Nord aux lacs du Sud dans un rythme adapté a tous",
      imageUrl: "https://static1.evcdn.net/cdn-cgi/image/width=1400,height=1050,quality=70,fit=crop/offer/raw/2022/07/27/57adf10e-50de-47b2-b07d-02d0d1ab8167.jpg",
      tags: ["Facile avec enfants en bas âge"],
      gallery: [
        "https://static1.evcdn.net/cdn-cgi/image/width=1400,height=1050,quality=70,fit=crop/offer/raw/2022/07/27/57adf10e-50de-47b2-b07d-02d0d1ab8167.jpg",
        "https://static1.evcdn.net/cdn-cgi/image/width=1400,height=1050,quality=70,fit=crop/offer/raw/2022/07/27/57adf10e-50de-47b2-b07d-02d0d1ab8167.jpg",
        "https://static1.evcdn.net/cdn-cgi/image/width=1400,height=1050,quality=70,fit=crop/offer/raw/2022/07/27/57adf10e-50de-47b2-b07d-02d0d1ab8167.jpg"
      ],
      itinerary: [
        {
          day: 1,
          title: "Arrivée à Chiang Mai",
          description: "Accueil à l'aéroport et transfert vers votre hôtel. Temps libre pour découvrir la ville."
        },
        {
          day: 2,
          title: "Visite des temples",
          description: "Découverte des temples historiques de Chiang Mai avec un guide local."
        },
        {
          day: 3,
          title: "Rencontre avec les ethnies",
          description: "Journée d'immersion dans les villages des ethnies du Nord."
        }
      ],
      practicalInfo: {
        difficulty: "Modéré",
        transport: "Inclus (minivan climatisé)",
        accommodation: "Hôtels 3-4 étoiles",
        meals: "Petit-déjeuner inclus",
        included: ["Guide francophone", "Transport", "Hébergement", "Activités mentionnées"],
        notIncluded: ["Vols internationaux", "Repas non mentionnés", "Dépenses personnelles"]
      },
      reviews: [
        {
          author: "Sophie",
          rating: 5,
          date: "20/01/2024",
          text: "Une expérience culturelle enrichissante pour toute la famille. Les ados ont particulièrement apprécié les rencontres avec les ethnies."
        }
      ],
      price: "À partir de 1 890€",
      priceDetails: "Prix par personne, base double"
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
          Famille {familyData?.familyName} • {familyData?.adults} adulte{familyData?.adults > 1 ? "s" : ""}, {familyData?.children} enfant
          {familyData?.children > 1 ? "s" : ""} ({familyData?.ages?.join(", ") || "?"} ans)
        </Text>
        <Text style={styles.familyInfo}>
          Type de voyage : {Array.isArray(familyData?.travelType) ? familyData.travelType.join(", ") : "Non spécifié"} • Budget : {familyData?.budget}
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
            {trip.price && (
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{trip.price}</Text>
                <Text style={styles.priceDetails}>{trip.priceDetails}</Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => navigation.navigate('TripDetail', { trip, isPast: false })}
            >
              <Text style={styles.ctaText}>Découvrir ce voyage</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
  priceContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f8066",
  },
  priceDetails: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0f8066',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
