import React, { useState, useRef } from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  Dimensions,
  FlatList,
  Animated
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { TripMap } from "../components/TripMap";
import { theme } from "../styles/theme";
import AgencyBlock from "../components/AgencyBlock";

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48; // Largeur de la carte avec marges
const CARD_MARGIN = 8;

// Données mockées pour le développement
const MOCK_TRIP_STEPS = [
  {
    coordinate: {
      latitude: 48.8566,
      longitude: 2.3522
    },
    name: "Paris",
    date: "15 Mars 2024",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    description: "Départ de l'aventure depuis Paris. Rendez-vous à l'aéroport Charles de Gaulle pour le grand départ !"
  },
  {
    coordinate: {
      latitude: 40.4168,
      longitude: -3.7038
    },
    name: "Madrid",
    date: "16 Mars 2024",
    imageUrl: "https://images.unsplash.com/photo-1543783207-ec64e4d95325",
    description: "Première escale à Madrid. Visite du Palais Royal et dégustation de tapas en famille."
  },
  {
    coordinate: {
      latitude: 36.7213,
      longitude: -4.4217
    },
    name: "Malaga",
    date: "18 Mars 2024",
    imageUrl: "https://images.unsplash.com/photo-1562677735-6b0b0b5b346b",
    description: "Arrivée à Malaga. Installation à l'hôtel et première baignade dans la Méditerranée !"
  }
];

const INITIAL_REGION = {
  latitude: 43.0,
  longitude: -3.0,
  latitudeDelta: 20,
  longitudeDelta: 20,
};

export default function CurrentTripDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { trip } = route.params || {};
  const [focusedStepIndex, setFocusedStepIndex] = useState(0);
  const flatListRef = useRef(null);

  const renderStepCard = ({ item, index }) => (
    <View style={[
      styles.stepCard,
      index === focusedStepIndex && styles.stepCardFocused
    ]}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepDate}>{item.date}</Text>
        <Text style={styles.stepName}>{item.name}</Text>
      </View>
      
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.stepImage}
        resizeMode="cover"
      />
      
      <Text style={styles.stepDescription}>{item.description}</Text>

      {/* Programme du jour */}
      <View style={styles.dayProgram}>
        <Text style={styles.dayProgramTitle}>Programme du jour</Text>
        <View style={styles.dayProgramItem}>
          <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.dayProgramText}>10:00 - Visite guidée</Text>
        </View>
        <View style={styles.dayProgramItem}>
          <Ionicons name="restaurant-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.dayProgramText}>12:30 - Déjeuner local</Text>
        </View>
        <View style={styles.dayProgramItem}>
          <Ionicons name="sunny-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.dayProgramText}>14:00 - Temps libre</Text>
        </View>
      </View>
    </View>
  );

  const onStepChange = (index) => {
    setFocusedStepIndex(index);
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5
    });
  };

  const getItemLayout = (_, index) => ({
    length: CARD_WIDTH + CARD_MARGIN * 2,
    offset: (CARD_WIDTH + CARD_MARGIN * 2) * index,
    index,
  });

  if (!trip) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.section, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={styles.errorText}>Impossible de charger les détails du voyage</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Header avec titre du voyage */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>{trip.title}</Text>
            <Text style={styles.headerDates}>{trip.date}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section principale : Carte + Carrousel */}
        <View style={styles.mainSection}>
          {/* Carte interactive */}
          <TripMap 
            steps={MOCK_TRIP_STEPS}
            initialRegion={INITIAL_REGION}
            focusedStepIndex={focusedStepIndex}
          />

          {/* Carrousel des étapes */}
          <FlatList
            ref={flatListRef}
            data={MOCK_TRIP_STEPS}
            renderItem={renderStepCard}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
            decelerationRate="fast"
            getItemLayout={getItemLayout}
            contentContainerStyle={styles.carouselContent}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_MARGIN * 2)
              );
              onStepChange(newIndex);
            }}
            initialScrollIndex={MOCK_TRIP_STEPS.length - 1}
          />
        </View>

        {/* Sections additionnelles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents importants</Text>
          <View style={styles.documentsGrid}>
            <TouchableOpacity style={styles.documentCard}>
              <Ionicons name="document-text-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.documentName}>Billets d'avion</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.documentCard}>
              <Ionicons name="bed-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.documentName}>Hôtels</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.documentCard}>
              <Ionicons name="shield-checkmark-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.documentName}>Assurance</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacts d'urgence</Text>
          <TouchableOpacity style={styles.emergencyButton}>
            <Ionicons name="call-outline" size={24} color="#fff" />
            <Text style={styles.emergencyButtonText}>Appeler l'agence locale</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F7F5ED',
  },
  header: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F7F5ED',
  },
  headerTitles: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerDates: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  mainSection: {
    marginTop: 8,
  },
  carouselContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  stepCard: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stepCardFocused: {
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
    transform: [{ scale: 1.02 }],
  },
  stepHeader: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepDate: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  stepName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  stepImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  dayProgram: {
    backgroundColor: '#F7F5ED',
    borderRadius: 12,
    padding: 8,
  },
  dayProgramTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  dayProgramItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayProgramText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  documentsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  documentCard: {
    width: (width - 48) / 3 - 8,
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  documentName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 