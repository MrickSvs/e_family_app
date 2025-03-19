import React, { useState } from "react";
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
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AgencyBlock from "../components/AgencyBlock";
import CreateTripModal from "../components/CreateTripModal";
import { getProfile } from "../services/profileService";
import { theme } from "../styles/theme";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 60;
const HERO_HEIGHT = 400;

export default function TripDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { trip, isPast } = route.params;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showCreateTripModal, setShowCreateTripModal] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollY = new Animated.Value(0);

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

  const renderHeroSection = () => (
    <Animated.View style={[styles.heroSection, { transform: [{ scale: heroScale }] }]}>
      <Image source={{ uri: trip.imageUrl }} style={styles.coverImage} />
      <View style={styles.heroContent}>
        <Text style={styles.title}>{trip.title}</Text>
        <View style={styles.mainInfo}>
          <Text style={styles.duration}>{trip.duration}</Text>
          <Text style={styles.type}>{trip.type}</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderUpcomingTripDetails = () => (
    <>
      {renderHeroSection()}
      
      <View style={styles.contentContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>À partir de</Text>
          <Text style={styles.price}>{trip.price}€</Text>
          <Text style={styles.priceDetails}>par personne</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos de ce voyage</Text>
          <Text style={styles.description}>{trip.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Points forts</Text>
          <View style={styles.highlightsContainer}>
            {trip.tags?.map((tag, index) => (
              <View key={index} style={styles.highlightItem}>
                <Text style={styles.highlightText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos du voyage</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.photoGallery}
            snapToInterval={width - 32}
            decelerationRate="fast"
          >
            {trip.photos?.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo }}
                style={styles.photoImage}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Points d'intérêt</Text>
          <View style={styles.pointsOfInterestContainer}>
            {trip.pointsOfInterest?.map((point, index) => (
              <View key={index} style={styles.pointOfInterestItem}>
                <View style={styles.pointOfInterestHeader}>
                  <Text style={styles.pointOfInterestTitle}>{point.title}</Text>
                  {point.duration && (
                    <Text style={styles.pointOfInterestDuration}>{point.duration}</Text>
                  )}
                </View>
                <Text style={styles.pointOfInterestDescription}>{point.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {trip.practicalInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations pratiques</Text>
            <View style={styles.practicalInfoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Niveau de difficulté</Text>
                <Text style={styles.infoValue}>{trip.practicalInfo.difficulty}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Transport</Text>
                <Text style={styles.infoValue}>{trip.practicalInfo.transport}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Hébergement</Text>
                <Text style={styles.infoValue}>{trip.practicalInfo.accommodation}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Repas</Text>
                <Text style={styles.infoValue}>{trip.practicalInfo.meals}</Text>
              </View>
            </View>

            <View style={styles.includedContainer}>
              <Text style={styles.includedTitle}>Ce qui est inclus</Text>
              {trip.practicalInfo.included.map((item, index) => (
                <View key={index} style={styles.includedItem}>
                  <Text style={styles.includedText}>✓ {item}</Text>
                </View>
              ))}
            </View>

            <View style={styles.includedContainer}>
              <Text style={styles.includedTitle}>Ce qui n'est pas inclus</Text>
              {trip.practicalInfo.notIncluded.map((item, index) => (
                <View key={index} style={styles.includedItem}>
                  <Text style={styles.includedText}>✗ {item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jour par jour</Text>
          <View style={styles.itineraryContainer}>
            {trip.itinerary ? (
              trip.itinerary.map((day, index) => (
                <View key={index} style={styles.dayContainer}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayNumber}>Jour {day.day}</Text>
                    <Text style={styles.dayTitle}>{day.title}</Text>
                  </View>
                  <View style={styles.dayContent}>
                    {day.steps && (
                      <View style={styles.stepsContainer}>
                        <Text style={styles.stepsTitle}>Étapes :</Text>
                        {day.steps.map((step, stepIndex) => (
                          <Text key={stepIndex} style={styles.stepText}>{step}</Text>
                        ))}
                      </View>
                    )}
                    <Text style={styles.dayDescription}>{day.description}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.dayDescription}>
                Jour 1 : Arrivée et installation{"\n"}
                Jour 2 : Découverte des sites principaux{"\n"}
                Jour 3 : Exploration des environs{"\n"}
                Jour 4 : Activités locales{"\n"}
                Jour 5 : Dernières découvertes et départ
              </Text>
            )}
          </View>
        </View>
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
              {loading ? 'Chargement...' : 'Créer un voyage'}
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
  duration: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  type: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  contentContainer: {
    backgroundColor: '#F7F5ED',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
  },
  priceContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  priceDetails: {
    fontSize: 14,
    color: "#666",
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
  photoGallery: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  photoImage: {
    width: width - 48,
    height: 250,
    marginRight: 16,
    borderRadius: 16,
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
  dayContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  dayHeader: {
    backgroundColor: '#F7F5ED',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
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
    color: "#666",
    lineHeight: 20,
    marginTop: 12,
  },
  stepsContainer: {
    marginBottom: 12,
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  stepText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 4,
  },
  practicalInfoContainer: {
    gap: 12,
  },
  infoItem: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
  },
  includedContainer: {
    marginTop: 16,
  },
  includedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  includedItem: {
    marginBottom: 4,
  },
  includedText: {
    fontSize: 14,
    color: "#666",
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
  pointsOfInterestContainer: {
    gap: 16,
  },
  pointOfInterestItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  pointOfInterestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointOfInterestTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  pointOfInterestDuration: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  pointOfInterestDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
}); 