import React, { useState } from "react";
import { SafeAreaView, ScrollView, ActivityIndicator, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getFamilyInfo } from "../services/familyService";
import { TripCard, InfoMessage } from "../components/design-system";
import { theme } from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";

const FamilyHeader = ({ family }) => {
  const navigation = useNavigation();

  if (!family) return null;

  const adultsCount = family.members?.filter(m => m.role === 'Adulte').length || 0;
  const childrenCount = family.members?.filter(m => m.role === 'Enfant').length || 0;

  return (
    <TouchableOpacity 
      style={styles.familyHeader}
      onPress={() => navigation.navigate('Profile')}
    >
      <View style={styles.familyContent}>
        <View style={styles.familyInfo}>
          <Text style={styles.familyName}>{family.family_name || 'Ma Famille'}</Text>
          <Text style={styles.familyComposition}>
            {adultsCount} adulte{adultsCount > 1 ? 's' : ''} • {childrenCount} enfant{childrenCount > 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.editIconContainer}>
          <Ionicons name="chevron-forward" size={20} color="#0F8066" />
        </View>
      </View>

      {family.travel_preferences?.travel_type?.length > 0 && (
        <Text style={styles.preferences}>
          {family.travel_preferences.travel_type.join(' • ')}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default function FamilyTripsScreen() {
  const navigation = useNavigation();
  const [familyData, setFamilyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFamilyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getFamilyInfo();
      console.log("✅ Données reçues:", response);
      setFamilyData(response);
    } catch (err) {
      console.error("❌ Erreur:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFamilyData();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0F8066" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Une erreur est survenue: {error}</Text>
        <TouchableOpacity onPress={loadFamilyData}>
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
      imageUrl: "https://static1.evcdn.net/cdn-cgi/image/width=1400,height=1050,quality=70,fit=crop/offer/raw/2024/08/28/9cea9434-1cec-45c4-81af-c30b87cba72f.jpg",
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
      imageUrl: "https://static1.evcdn.net/cdn-cgi/image/width=1400,height=1050,quality=70,fit=crop/offer/raw/2023/06/19/e389cda8-ad5f-4145-8517-f7d76c636b19.jpg",
      tags: ["Culture", "Gastronomie"],
      price: 1590,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Evaneos Family</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <FamilyHeader family={familyData} />
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
    padding: 16,
    backgroundColor: '#F7F5ED',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  errorText: {
    color: '#FF0000',
    textAlign: 'center',
    margin: 16,
  },
  retryText: {
    color: '#0F8066',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  familyHeader: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  familyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  familyInfo: {
    flex: 1,
  },
  familyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  familyComposition: {
    fontSize: 14,
    color: '#666666',
  },
  preferences: {
    fontSize: 13,
    color: '#0F8066',
    marginTop: 8,
  },
  editIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0F806610',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 16,
  },
});
