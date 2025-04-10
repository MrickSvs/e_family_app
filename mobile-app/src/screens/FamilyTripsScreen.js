import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, ActivityIndicator, StyleSheet, View, TouchableOpacity, Text, Image, TextInput } from "react-native";
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

const DestinationsSection = ({ destinations, onDestinationPress }) => {
  if (!destinations?.length) return null;

  return (
    <View style={styles.destinationsSection}>
      <Text style={styles.sectionTitle}>Destinations qui vous correspondent</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.destinationsContainer}
      >
        {destinations.map((destination) => (
          <TouchableOpacity
            key={destination.id}
            style={styles.destinationCard}
            onPress={() => onDestinationPress(destination)}
          >
            <Image
              source={{ uri: destination.image_url }}
              style={styles.destinationImage}
            />
            <View style={styles.destinationInfo}>
              <Text style={styles.destinationName}>{destination.name}</Text>
              <Text style={styles.destinationDescription}>{destination.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const SearchBar = ({ onSearch, destinations, onDestinationPress }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (text) => {
    setSearchQuery(text);
    onSearch(text);
    setShowResults(true);
  };

  const filteredDestinations = destinations.filter(destination =>
    destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    destination.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#666666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une destination..."
          placeholderTextColor="#666666"
          value={searchQuery}
          onChangeText={handleSearch}
          onFocus={() => setShowResults(true)}
        />
      </View>
      {showResults && searchQuery.length > 0 && (
        <View style={styles.searchResults}>
          {filteredDestinations.map((destination) => (
            <TouchableOpacity
              key={destination.id}
              style={styles.searchResultItem}
              onPress={() => {
                onDestinationPress(destination);
                setShowResults(false);
                setSearchQuery('');
              }}
            >
              <Image
                source={{ uri: destination.image_url }}
                style={styles.searchResultImage}
              />
              <View style={styles.searchResultInfo}>
                <Text style={styles.searchResultName}>{destination.name}</Text>
                <Text style={styles.searchResultDescription} numberOfLines={1}>
                  {destination.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default function FamilyTripsScreen() {
  const navigation = useNavigation();
  const [familyData, setFamilyData] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (itineraryId) => {
    setFavorites(prev => {
      if (prev.includes(itineraryId)) {
        return prev.filter(id => id !== itineraryId);
      } else {
        return [...prev, itineraryId];
      }
    });
  };

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

      // TODO: Implémenter getDestinations dans le service
      // const destinationsData = await getDestinations();
      // setDestinations(destinationsData);
      
      // Données temporaires pour la démonstration
      setDestinations([
        {
          id: 1,
          name: "Bali",
          description: "Île paradisiaque",
          image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=60"
        },
        {
          id: 2,
          name: "Thaïlande",
          description: "Culture et plages",
          image_url: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&auto=format&fit=crop&q=60"
        },
        {
          id: 3,
          name: "Japon",
          description: "Traditions et modernité",
          image_url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=60"
        },
        {
          id: 4,
          name: "Maroc",
          description: "Mystère et authenticité",
          image_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=60"
        }
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Une erreur est survenue lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    if (!text.trim()) {
      setFilteredDestinations(destinations);
      return;
    }
    
    const filtered = destinations.filter(destination =>
      destination.name.toLowerCase().includes(text.toLowerCase()) ||
      destination.description.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredDestinations(filtered);
  };

  useEffect(() => {
    setFilteredDestinations(destinations);
  }, [destinations]);

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

      <View style={styles.familyHeaderContainer}>
        <FamilyHeader family={familyData} />
      </View>

      <SearchBar 
        onSearch={handleSearch} 
        destinations={destinations}
        onDestinationPress={(destination) => navigation.navigate('Destination', { destination })}
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <DestinationsSection 
          destinations={filteredDestinations}
          onDestinationPress={(destination) => navigation.navigate('Destination', { destination })}
        />

        <View style={styles.itinerariesSection}>
          <Text style={styles.sectionTitle}>Vos itinéraires personnalisés</Text>
          {itineraries.map((itinerary) => (
            <View key={itinerary.id} style={styles.itineraryCardContainer}>
              <TripCard
                trip={{
                  id: itinerary.id,
                  title: itinerary.title,
                  duration: `${itinerary.duration} jours`,
                  type: itinerary.type,
                  description: itinerary.description,
                  image_url: itinerary.image_url,
                  tags: itinerary.tags,
                  price: itinerary.price
                }}
                onPress={() => navigation.navigate('TripDetail', { trip: itinerary, isPast: false })}
                familyMembers={familyData?.members || []}
              />
              <TouchableOpacity 
                onPress={() => toggleFavorite(itinerary.id)}
                style={styles.favoriteButton}
              >
                <Ionicons 
                  name={favorites.includes(itinerary.id) ? "heart" : "heart-outline"} 
                  size={24} 
                  color={favorites.includes(itinerary.id) ? "#ff4b4b" : "#666"} 
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
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
  familyHeaderContainer: {
    backgroundColor: '#F7F5ED',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
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
  destinationsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
    marginLeft: 16,
  },
  destinationsContainer: {
    paddingHorizontal: 16,
  },
  destinationCard: {
    width: 280,
    height: 180,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  destinationImage: {
    width: '100%',
    height: 120,
  },
  destinationInfo: {
    padding: 12,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  destinationDescription: {
    fontSize: 14,
    color: '#666666',
  },
  itinerariesSection: {
    marginTop: 24,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F7F5ED',
    position: 'relative',
    zIndex: 1000,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1001,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  searchResults: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1002,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  searchResultImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F5F5F5',
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  searchResultDescription: {
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 20,
  },
  itineraryCardContainer: {
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
