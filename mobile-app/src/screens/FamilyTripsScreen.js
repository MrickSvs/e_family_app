import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, ActivityIndicator, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getFamilyInfo } from "../services/familyService";
import { getItineraries } from "../services/itineraryService";
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
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer les informations de la famille
      const familyInfo = await getFamilyInfo();
      setFamilyData(familyInfo);

      // Récupérer les itinéraires
      const itinerariesData = await getItineraries();
      setItineraries(itinerariesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Une erreur est survenue lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchData();
  }, []);

  // Recharger les données quand l'écran est focalisé
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchData}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
        {itineraries.map((itinerary) => (
          <TripCard
            key={itinerary.id}
            trip={{
              id: itinerary.id,
              title: itinerary.title,
              duration: `${itinerary.duration} jours`,
              type: itinerary.type,
              description: itinerary.description,
              imageUrl: itinerary.image_url,
              tags: itinerary.tags,
              price: itinerary.price
            }}
            onPress={() => navigation.navigate('TripDetail', { trip: itinerary, isPast: false })}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 16,
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
