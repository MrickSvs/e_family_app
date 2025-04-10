import React, { useState, useRef, useEffect } from "react";
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
  Animated,
  Modal,
  ActivityIndicator
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { TripMap } from "../components/TripMap";
import { theme } from "../styles/theme";
import AgencyBlock from "../components/AgencyBlock";
import DayDetailModal from "../components/DayDetailModal";
import FamilyPhotoGallery from "../components/FamilyPhotoGallery";
import FamilyPhotoService from "../services/FamilyPhotoService";

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48; // Largeur de la carte avec marges
const CARD_MARGIN = 8;

// Mapping des emojis vers les icônes Ionicons
const iconMapping = {
  'boat': 'boat-outline',
  'restaurant': 'restaurant-outline',
  'beach': 'sunny-outline',
  'diving': 'water-outline',
  'walking': 'walk-outline',
  'finish': 'flag-outline',
  'hotel': 'bed-outline',
  'food': 'restaurant-outline',
  'bicycle': 'bicycle-outline',
  'art': 'color-palette-outline',
  'ship': 'boat-outline',
  'fish': 'fish-outline',
  'temple': 'business-outline',
  'pray': 'heart-outline',
  'bus': 'bus-outline',
  'cycling': 'bicycle-outline'
};

// Données mockées pour le développement
const MOCK_TRIP_STEPS = [
  {
    coordinate: {
      latitude: 9.9281,
      longitude: -84.0907
    },
    name: "San José",
    date: "15 Mars 2024",
    imageUrl: "https://images.visitarcostarica.com/turismo-en-san-jose.jpg",
    description: "Arrivée à San José ! Installation à l'hôtel et première découverte de la capitale costaricaine.",
    program: [
      { time: "14:00", activity: "Arrivée à l'aéroport", icon: "airplane-outline" },
      { time: "16:00", activity: "Check-in à l'hôtel", icon: "hotel" },
      { time: "18:00", activity: "Dîner de bienvenue", icon: "restaurant" }
    ],
    status: 'past',
    memories: {
      photos: [
        "https://images.unsplash.com/photo-1518183261945-b0989cfb3723",
        "https://images.unsplash.com/photo-1589308454676-21b1aa8b8c1c"
      ],
      notes: "Super première journée au Costa Rica ! L'hôtel est magnifique et le dîner était délicieux."
    }
  },
  {
    coordinate: {
      latitude: 10.4627,
      longitude: -84.7034
    },
    name: "Arenal",
    date: "16 Mars 2024",
    imageUrl: "https://beauvoyage.com/cdn/shop/articles/arenal.jpg?crop=center&height=540&v=1708357317&width=810",
    description: "Direction le parc national de l'Arenal ! Découverte du volcan et des sources chaudes en famille.",
    program: [
      { time: "09:00", activity: "Randonnée au volcan", icon: "walking" },
      { time: "12:30", activity: "Pique-nique tropical", icon: "food" },
      { time: "15:00", activity: "Sources chaudes", icon: "diving" }
    ],
    status: 'current',
    memories: {
      photos: [],
      notes: ""
    }
  },
  {
    coordinate: {
      latitude: 9.3920,
      longitude: -84.1307
    },
    name: "Manuel Antonio",
    date: "18 Mars 2024",
    imageUrl: "https://www.visitcostarica.com/sites/default/files/2024-10/Aerial%20Drone%20view%20of%20Manuel%20Antonio%20National%20Park%20in%20Costa%20Rica.%20.jpg",
    description: "Parc national de Manuel Antonio : plages paradisiaques, singes capucins et activités pour toute la famille !",
    program: [
      { time: "08:00", activity: "Visite du parc national", icon: "leaf-outline" },
      { time: "11:00", activity: "Plage et baignade", icon: "beach" },
      { time: "15:00", activity: "Observation des singes", icon: "eye-outline" }
    ],
    status: 'upcoming'
  },
  {
    coordinate: {
      latitude: 10.2993,
      longitude: -85.8371
    },
    name: "Tamarindo",
    date: "20 Mars 2024",
    imageUrl: "https://images.ctfassets.net/bth3mlrehms2/4rwmLuPvkyend6Mn405q9e/04b59338502099d6b23e6062da83d407/Tamarindo__Guanacaste__Costa_Rica_.jpg",
    description: "Détente à Tamarindo : surf pour les plus grands, jeux de plage pour les petits et coucher de soleil pour tous !",
    program: [
      { time: "10:00", activity: "Cours de surf en famille", icon: "boat" },
      { time: "13:00", activity: "Déjeuner sur la plage", icon: "restaurant" },
      { time: "16:00", activity: "Balade en bateau", icon: "compass-outline" }
    ],
    status: 'upcoming'
  }
];

const INITIAL_REGION = {
  latitude: 9.7489,
  longitude: -83.7534,
  latitudeDelta: 3,
  longitudeDelta: 3,
};

export default function CurrentTripDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { trip } = route.params || {};
  
  // Trouver l'index du jour en cours
  const currentDayIndex = MOCK_TRIP_STEPS.findIndex(step => step.status === 'current');
  
  const [focusedStepIndex, setFocusedStepIndex] = useState(currentDayIndex);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isDayDetailModalVisible, setIsDayDetailModalVisible] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    if (trip?.id) {
      const tripPhotos = await FamilyPhotoService.getPhotos(trip.id);
      setPhotos(tripPhotos);
    }
    setIsLoadingPhotos(false);
  };

  const handleAddPhotos = async (tripId) => {
    const newPhotos = await FamilyPhotoService.addPhotos(tripId);
    if (newPhotos.length > 0) {
      setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
    }
  };

  const handleDeletePhoto = async (tripId, photoId) => {
    await FamilyPhotoService.deletePhoto(tripId, photoId);
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId));
  };

  const handleAddComment = async (tripId, photoId, comment) => {
    await FamilyPhotoService.addComment(tripId, photoId, comment);
    const updatedPhotos = await FamilyPhotoService.getPhotos(tripId);
    setPhotos(updatedPhotos);
  };

  const handleLikePhoto = async (tripId, photoId) => {
    await FamilyPhotoService.likePhoto(tripId, photoId);
    const updatedPhotos = await FamilyPhotoService.getPhotos(tripId);
    setPhotos(updatedPhotos);
  };

  const handleDayPress = (day) => {
    setSelectedDay(day);
    setIsDayDetailModalVisible(true);
  };

  const renderStepCard = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => handleDayPress(item)}
      style={[
        styles.stepCard,
        index === focusedStepIndex && styles.stepCardFocused,
        item.status === 'past' && styles.stepCardPast,
        item.status === 'current' && styles.stepCardCurrent,
        item.status === 'upcoming' && styles.stepCardUpcoming,
      ]}>
      <View style={styles.stepHeader}>
        <Text style={[
          styles.stepDate,
          item.status === 'past' && styles.stepDatePast,
          item.status === 'current' && styles.stepDateCurrent,
        ]}>{item.date}</Text>
        <Text style={[
          styles.stepName,
          item.status === 'past' && styles.stepNamePast,
          item.status === 'current' && styles.stepNameCurrent,
        ]}>{item.name}</Text>
      </View>
      
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.stepImage}
        resizeMode="cover"
      />
      
      <Text style={styles.stepDescription}>{item.description}</Text>

      {/* Programme du jour */}
      <View style={[
        styles.dayProgram,
        item.status === 'past' && styles.dayProgramPast,
        item.status === 'current' && styles.dayProgramCurrent,
      ]}>
        <Text style={styles.dayProgramTitle}>Programme du jour</Text>
        {item.program.map((activity, idx) => (
          <View key={idx} style={styles.dayProgramItem}>
            <Ionicons 
              name={iconMapping[activity.icon] || activity.icon || "time-outline"} 
              size={16} 
              color={theme.colors.primary} 
            />
            <Text style={styles.dayProgramText}>{activity.time} - {activity.activity}</Text>
          </View>
        ))}
      </View>

      {/* Bouton d'ajout de souvenirs pour les jours passés et en cours */}
      {(item.status === 'past' || item.status === 'current') && (
        <TouchableOpacity 
          style={styles.addMemoriesButton}
          onPress={() => {
            // TODO: Implémenter l'ajout de souvenirs
            console.log('Ajouter des souvenirs pour le jour:', item.name);
          }}
        >
          <Ionicons 
            name={item.memories?.photos.length > 0 ? "images" : "add-circle"} 
            size={24} 
            color={theme.colors.primary} 
          />
          <Text style={styles.addMemoriesText}>
            {item.memories?.photos.length > 0 
              ? `${item.memories.photos.length} photos ajoutées` 
              : "Ajouter des souvenirs"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Affichage des souvenirs si existants */}
      {item.status === 'past' && item.memories?.photos.length > 0 && (
        <View style={styles.memoriesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.memoriesScroll}
          >
            {item.memories.photos.map((photo, photoIndex) => (
              <Image 
                key={photoIndex}
                source={{ uri: photo }} 
                style={styles.memoryPhoto}
              />
            ))}
          </ScrollView>
          {item.memories.notes && (
            <Text style={styles.memoryNotes}>{item.memories.notes}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
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
            initialScrollIndex={currentDayIndex}
          />
        </View>

        {/* Galerie photos familiales */}
        <View style={styles.section}>
          {isLoadingPhotos ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <FamilyPhotoGallery
              tripId={trip.id}
              photos={photos}
              onAddPhotos={handleAddPhotos}
              onDeletePhoto={handleDeletePhoto}
              onAddComment={handleAddComment}
              onLikePhoto={handleLikePhoto}
            />
          )}
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

      <DayDetailModal
        visible={isDayDetailModalVisible}
        onClose={() => setIsDayDetailModalVisible(false)}
        day={selectedDay}
        onSaveFeedback={(feedback) => {
          // TODO: Implement feedback saving logic
          console.log('Saving feedback:', feedback);
          setIsDayDetailModalVisible(false);
        }}
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
  stepCardPast: {
    opacity: 0.8,
    borderLeftWidth: 4,
    borderLeftColor: '#8E8E93',
  },
  stepCardCurrent: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  stepCardUpcoming: {
    opacity: 0.9,
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
  stepDatePast: {
    color: '#8E8E93',
  },
  stepDateCurrent: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  stepName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  stepNamePast: {
    color: '#8E8E93',
  },
  stepNameCurrent: {
    color: '#000',
    fontWeight: '800',
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
  dayProgramPast: {
    backgroundColor: '#F2F2F7',
  },
  dayProgramCurrent: {
    backgroundColor: '#E8F3F0',
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