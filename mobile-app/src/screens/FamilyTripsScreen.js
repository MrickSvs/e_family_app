import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, ActivityIndicator, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getFamilyInfo } from "../services/familyService";
import { Text, TripCard, InfoMessage } from "../components/design-system";
import { theme } from "../styles/theme";

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
      <SafeAreaView style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContainer]}>
        <InfoMessage
          variant="error"
          message={`Une erreur est survenue: ${error}`}
        />
        <Text
          variant="body"
          color="primary"
          style={styles.retryText}
          onPress={loadFamilyData}
        >
          Réessayer
        </Text>
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
      price: 2490,
    },
    {
      id: 2,
      title: "Thaïlande, rencontres ethniques",
      duration: "7 jours",
      type: "Exploration",
      description:
        "Partez visiter les montagnes du Nord aux lacs du Sud dans un rythme adapté a tous",
      imageUrl: "https://static1.evcdn.net/cdn-cgi/image/width=1400,height=1050,quality=70,fit=crop/offer/raw/2022/07/27/57adf10e-50de-47b2-b07d-02d0d1ab8167.jpg",
      tags: ["Facile avec enfants en bas âge"],
      price: 1890,
    },
    {
      id: 3,
      title: "Safari Afrique du Sud",
      duration: "14 jours",
      type: "Aventure & culture",
      description:
        "Une expérience unique pour observer les Big Five dans leur habitat naturel",
      imageUrl: "https://static1.evcdn.net/cdn-cgi/image/width=1400,height=1050,quality=70,fit=crop/offer/raw/2022/07/27/57adf10e-50de-47b2-b07d-02d0d1ab8167.jpg",
      tags: ["Safari", "Aventure"],
      price: 3290,
    },
    {
      id: 4,
      title: "Italie : Douceur Toscane",
      duration: "7 jours",
      type: "Culture & détente",
      description:
        "Un rythme adapté, des découvertes culturelles et une gastronomie accessible à tous",
      imageUrl: "https://static1.evcdn.net/cdn-cgi/image/width=1400,height=1050,quality=70,fit=crop/offer/raw/2022/07/27/57adf10e-50de-47b2-b07d-02d0d1ab8167.jpg",
      tags: ["Culture", "Gastronomie"],
      price: 1590,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Evaneos Family</Text>
          <View style={styles.yellowDot} />
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onPress={() => navigation.navigate('TripDetail', { trip, isPast: false })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5ED',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F7F5ED',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  yellowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.secondary,
    marginLeft: 8,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  scrollContainer: {
    paddingVertical: 16,
  },
  retryText: {
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});
