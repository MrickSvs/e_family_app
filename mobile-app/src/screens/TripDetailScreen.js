import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated,
  FlatList,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { TripMap } from "../components/TripMap";
import { LocalTips } from "../components/LocalTips";
import { FlightPrices } from "../components/FlightPrices";
import AgencyBlock from "../components/AgencyBlock";
import CreateTripModal from "../components/CreateTripModal";
import { getProfile } from "../services/profileService";
import { theme } from "../styles/theme";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 60;
const HERO_HEIGHT = 400;
const CARD_WIDTH = width - 48;
const CARD_MARGIN = 8;

export default function TripDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { trip, isPast } = route.params;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showCreateTripModal, setShowCreateTripModal] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT - HEADER_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const heroScale = scrollY.interpolate({
    inputRange: [-100, 0, HERO_HEIGHT],
    outputRange: [1.2, 1, 0.8],
    extrapolate: 'clamp',
  });

  // Charger les membres de la famille
  const loadFamilyMembers = async () => {
    try {
      setLoading(true);
      const profile = await getProfile();
      setFamilyMembers(profile.members || []);
    } catch (error) {
      console.error("Erreur lors du chargement des membres:", error);
      Alert.alert('Erreur', 'Impossible de charger les membres de la famille');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = () => {
    loadFamilyMembers();
    setShowCreateTripModal(true);
  };

  const renderHeader = () => (
    <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderImageCard = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.imageCard,
        index === selectedImageIndex && styles.imageCardFocused
      ]}
      onPress={() => setSelectedImageIndex(index)}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.imageCardImage}
        resizeMode="cover"
      />
      <View style={styles.imageCardContent}>
        <Text style={styles.imageCardTitle}>{item.title}</Text>
        <Text style={styles.imageCardDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeroSection = () => (
    <Animated.View style={[styles.heroSection, { transform: [{ scale: heroScale }] }]}>
      <Image source={{ uri: trip.imageUrl }} style={styles.coverImage} />
      <View style={styles.heroContent}>
        <Text style={styles.title}>{trip.title}</Text>
        <View style={styles.mainInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={20} color="#fff" />
            <Text style={styles.infoText}>{trip.duration}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.infoText}>{trip.recommendedPeriod}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderImageCarousel = () => {
    const images = trip.points?.map(point => ({
      imageUrl: point.imageUrl,
      title: point.title,
      description: point.description
    })) || [];

    if (images.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos du voyage</Text>
        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={renderImageCard}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContent}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_MARGIN * 2)
            );
            setSelectedImageIndex(newIndex);
          }}
        />
      </View>
    );
  };

  const renderSummarySection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Résumé du voyage</Text>
      <Text style={styles.description}>{trip.description}</Text>
      <View style={styles.summaryInfo}>
        <View style={styles.summaryItem}>
          <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.summaryLabel}>Période recommandée</Text>
          <Text style={styles.summaryValue}>{trip.recommendedPeriod}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Ionicons name="map-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.summaryLabel}>Points d'intérêt</Text>
          <Text style={styles.summaryValue}>{trip.pointsOfInterest?.length || 0}</Text>
        </View>
      </View>
    </View>
  );

  const renderDetailedItinerary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Itinéraire détaillé</Text>
      {trip.points?.map((day, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.dayCard}
          onPress={() => navigation.navigate('DayDetail', { day, trip })}
        >
          <View style={styles.dayHeader}>
            <Text style={styles.dayNumber}>Jour {day.day}</Text>
            <Text style={styles.dayTitle}>{day.title}</Text>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.dayContent}>
            <Text style={styles.dayDescription}>{day.description}</Text>
            {day.steps?.slice(0, 3).map((step, stepIndex) => (
              <View key={stepIndex} style={styles.stepItem}>
                <Ionicons name={step.icon || "time-outline"} size={16} color="#666" />
                <Text style={styles.stepText}>{step.time} - {step.activity}</Text>
              </View>
            ))}
            {day.steps?.length > 3 && (
              <Text style={styles.moreSteps}>+ {day.steps.length - 3} autres activités</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderInteractiveMap = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Carte interactive</Text>
      <View style={styles.mapContainer}>
        <TripMap 
          itinerary={trip} 
          style={styles.map}
          showFamilyTips={true}
        />
        <TouchableOpacity 
          style={styles.mapButton}
          onPress={() => navigation.navigate('FullMap', { itinerary: trip })}
        >
          <Ionicons name="expand-outline" size={24} color="#fff" />
          <Text style={styles.mapButtonText}>Voir la carte complète</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPracticalInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Informations pratiques</Text>
      <View style={styles.practicalInfoGrid}>
        <View style={styles.practicalInfoItem}>
          <Ionicons name="bed-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.practicalInfoLabel}>Hébergement</Text>
          <Text style={styles.practicalInfoValue}>{trip.practicalInfo?.accommodation}</Text>
        </View>
        <View style={styles.practicalInfoItem}>
          <Ionicons name="restaurant-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.practicalInfoLabel}>Repas</Text>
          <Text style={styles.practicalInfoValue}>{trip.practicalInfo?.meals}</Text>
        </View>
        <View style={styles.practicalInfoItem}>
          <Ionicons name="bus-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.practicalInfoLabel}>Transport</Text>
          <Text style={styles.practicalInfoValue}>{trip.practicalInfo?.transport}</Text>
        </View>
      </View>
    </View>
  );

  const renderUpcomingTripDetails = () => (
    <>
      {renderHeroSection()}
      
      <View style={styles.contentContainer}>
        {renderSummarySection()}
        {renderImageCarousel()}
        {renderInteractiveMap()}
        {renderDetailedItinerary()}
        {renderPracticalInfo()}
        <LocalTips 
          familyProfile={trip.familyProfile}
          destination={trip.destination}
        />
        <FlightPrices 
          destination={trip.destination}
          origin="Paris"
        />
        <AgencyBlock 
          agency={{
            name: "L'agence de Virginie",
            imageUrl: "https://static1.evcdn.net/images/reduction/1649071_w-768_h-1024_q-70_m-crop.jpg",
            rating: 4.5,
            reviewCount: 75,
            tags: ["Famille avec enfants", "Incontournables"],
            memberSince: "1 an",
            experience: "3 ans",
            languages: ["Espagnol", "Français"],
            location: "Espagne"
          }}
        />
      </View>
    </>
  );

  const renderPastTripDetails = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>À propos de ce voyage</Text>
        <Text style={styles.description}>{trip.description}</Text>
      </View>

      {trip.gallery && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Galerie photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trip.gallery.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.galleryImage}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {trip.highlights && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Points forts</Text>
          <View style={styles.highlightsContainer}>
            {trip.highlights.map((highlight, index) => (
              <View key={index} style={styles.highlightItem}>
                <Text style={styles.highlightText}>{highlight}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {trip.memories && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Souvenirs mémorables</Text>
          {trip.memories.map((memory, index) => (
            <View key={index} style={styles.memoryItem}>
              <Text style={styles.memoryTitle}>{memory.title}</Text>
              <Text style={styles.memoryDescription}>{memory.description}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Note globale</Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <Text key={i} style={styles.ratingStar}>
              {i < trip.rating ? "★" : "☆"}
            </Text>
          ))}
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Animated.ScrollView 
        stickyHeaderIndices={[0]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {renderHeader()}
        {isPast ? renderPastTripDetails() : renderUpcomingTripDetails()}
      </Animated.ScrollView>

      {!isPast && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={handleCreateTrip}
            disabled={loading}
          >
            <Text style={styles.bookButtonText}>
              {loading ? 'Chargement...' : 'Demander un devis'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <CreateTripModal
        visible={showCreateTripModal}
        onClose={() => setShowCreateTripModal(false)}
        itinerary={trip}
        familyMembers={familyMembers}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F7F5ED',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#F7F5ED',
    zIndex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  heroSection: {
    height: HERO_HEIGHT,
    position: 'relative',
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  mainInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  infoText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
  },
  summaryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  contentContainer: {
    backgroundColor: '#F7F5ED',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
  },
  section: {
    padding: 24,
    backgroundColor: '#fff',
    marginTop: 16,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  highlightsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  highlightItem: {
    backgroundColor: "#e2f4f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  highlightText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  dayContent: {
    padding: 16,
  },
  dayDescription: {
    fontSize: 14,
    color: theme.colors.text.medium,
    marginBottom: 12,
    lineHeight: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  moreSteps: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 8,
    textAlign: 'right',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  practicalInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  practicalInfoItem: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  practicalInfoLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  practicalInfoValue: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  galleryImage: {
    width: 200,
    height: 150,
    marginRight: 8,
    borderRadius: 8,
  },
  memoryItem: {
    marginBottom: 12,
  },
  memoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  memoryDescription: {
    fontSize: 14,
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  ratingStar: {
    color: theme.colors.secondary,
    fontSize: 24,
    marginRight: 4,
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bookButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  mapContainer: {
    height: 300,
    marginVertical: 8,
  },
  map: {
    height: '100%',
  },
  carouselContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  imageCard: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageCardFocused: {
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
    transform: [{ scale: 1.02 }],
  },
  imageCardImage: {
    width: '100%',
    height: 200,
  },
  imageCardContent: {
    padding: 16,
  },
  imageCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  imageCardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 