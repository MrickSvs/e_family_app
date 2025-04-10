// src/screens/PastTripDetailScreen.js

import React, { useState, useEffect } from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AgencyBlock from "../components/AgencyBlock";
import FamilyPhotoGallery from "../components/FamilyPhotoGallery";
import FamilyPhotoService from "../services/FamilyPhotoService";
import { theme } from "../styles/theme";

export default function PastTripDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { trip } = route.params || {};
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    if (trip?.id) {
      const tripPhotos = await FamilyPhotoService.getPhotos(trip.id);
      setPhotos(tripPhotos);
    }
    setIsLoading(false);
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

  console.log('PastTripDetailScreen - route.params:', route.params);
  console.log('PastTripDetailScreen - trip:', trip);

  if (!trip) {
    console.error('Aucun voyage fourni dans les paramètres');
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
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <Image source={{ uri: trip.imageUrl }} style={styles.coverImage} />
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{trip.title}</Text>
          <Text style={styles.date}>{trip.date}</Text>

          {/* Note globale */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingTitle}>Note globale</Text>
            <View style={styles.starsContainer}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < trip.rating ? "star" : "star-outline"}
                  size={24}
                  color="#FFD700"
                />
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>À propos du voyage</Text>
            <Text style={styles.description}>{trip.description}</Text>
          </View>

          {/* Souvenirs */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Souvenirs mémorables</Text>
            {trip.memories?.map((memory, index) => (
              <View key={index} style={styles.memoryItem}>
                <Text style={styles.memoryTitle}>{memory.title}</Text>
                <Text style={styles.memoryText}>{memory.description}</Text>
              </View>
            ))}
          </View>

          {/* Galerie photos familiales */}
          <View style={styles.section}>
            {isLoading ? (
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  coverImage: {
    width: "100%",
    height: 250,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  ratingContainer: {
    marginBottom: 24,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: "row",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  memoryItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  memoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  memoryText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
});
