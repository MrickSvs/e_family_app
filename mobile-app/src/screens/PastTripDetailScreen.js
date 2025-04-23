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
  ActivityIndicator,
  Share
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AgencyBlock from "../components/AgencyBlock";
import FamilyPhotoGallery from "../components/FamilyPhotoGallery";
import FamilyPhotoService from "../services/FamilyPhotoService";
import { theme } from "../styles/theme";

const DEFAULT_COVER_IMAGE = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop";

export default function PastTripDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { trip } = route.params || {};
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    loadPhotos();
    loadFamilyMembers();
  }, []);

  const loadFamilyMembers = async () => {
    // Simuler le chargement des membres de la famille
    // À remplacer par un vrai appel API
    setFamilyMembers([
      { id: 1, name: "Papa", avatar: "https://example.com/avatar1.jpg" },
      { id: 2, name: "Maman", avatar: "https://example.com/avatar2.jpg" },
      { id: 3, name: "Enfant 1", avatar: "https://example.com/avatar3.jpg" },
      { id: 4, name: "Enfant 2", avatar: "https://example.com/avatar4.jpg" },
    ]);
  };

  const handleExportAlbum = async () => {
    try {
      // Créer un résumé du voyage
      const tripSummary = {
        title: trip.title,
        date: trip.date,
        rating: trip.rating,
        description: trip.description,
        photos: photos,
        memories: trip.memories,
        familyReviews: familyMembers.map(member => ({
          memberName: member.name,
          rating: trip.rating, // À remplacer par les vraies notes
          comment: "Super voyage !" // À remplacer par les vrais commentaires
        }))
      };

      // Convertir en format partageable
      const shareableContent = JSON.stringify(tripSummary, null, 2);
      
      // Partager l'album
      await Share.share({
        message: `Album souvenir - ${trip.title}\n\n${shareableContent}`,
        title: `Album souvenir - ${trip.title}`
      });
    } catch (error) {
      console.error('Erreur lors de l\'export de l\'album:', error);
    }
  };

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
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Bannière */}
        <View style={styles.banner}>
          <Image 
            source={{ 
              uri: !imageError ? (trip?.imageUrl || DEFAULT_COVER_IMAGE) : DEFAULT_COVER_IMAGE 
            }}
            style={styles.bannerImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>{trip?.title || "Détails du voyage"}</Text>
            <Text style={styles.bannerDates}>{trip?.date || ""}</Text>
          </View>
        </View>

        {/* Note globale */}
        <View style={styles.section}>
          <View style={styles.ratingCard}>
            <View style={styles.ratingHeader}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <Text style={styles.ratingTitle}>Note globale</Text>
            </View>
            <View style={styles.ratingStarsContainer}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < (trip?.rating || 0) ? "star" : "star-outline"}
                  size={24}
                  color="#FFD700"
                  style={styles.ratingStar}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Avis de la famille */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avis de la famille</Text>
          {familyMembers.map((member) => (
            <View key={member.id} style={styles.memberReviewCard}>
              <View style={styles.memberInfo}>
                <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                <View style={styles.memberDetails}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <View style={styles.memberStars}>
                    {[...Array(5)].map((_, i) => (
                      <Ionicons
                        key={i}
                        name={i < trip.rating ? "star" : "star-outline"}
                        size={16}
                        color="#FFD700"
                      />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.memberComment}>{member.comment || "Super voyage !"}</Text>
            </View>
          ))}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos du voyage</Text>
          <View style={styles.descriptionCard}>
            <Text style={styles.description}>{trip.description}</Text>
          </View>
        </View>

        {/* Souvenirs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Souvenirs mémorables</Text>
          {trip.memories?.map((memory, index) => (
            <View key={index} style={styles.memoryCard}>
              <Text style={styles.memoryTitle}>{memory.title}</Text>
              <Text style={styles.memoryText}>{memory.description}</Text>
            </View>
          ))}
        </View>

        {/* Galerie photos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Photos du voyage</Text>
            <TouchableOpacity 
              style={styles.createAlbumButton}
              onPress={handleExportAlbum}
            >
              <Ionicons name="book-outline" size={20} color="#fff" />
              <Text style={styles.createAlbumButtonText}>Créer l'album souvenir</Text>
            </TouchableOpacity>
          </View>
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
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  banner: {
    backgroundColor: "#F7F5ED",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  bannerImage: {
    width: "100%",
    height: 180,
  },
  bannerTextContainer: {
    padding: 16,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  bannerDates: {
    fontSize: 14,
    color: "#555",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  ratingCard: {
    backgroundColor: "#FFF8E1",
    borderRadius: 8,
    padding: 16,
  },
  ratingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  ratingStarsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ratingStar: {
    marginHorizontal: 2,
  },
  memberReviewCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  memberInfo: {
    flexDirection: "row",
    marginBottom: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  memberStars: {
    flexDirection: "row",
  },
  memberComment: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  descriptionCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  memoryCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  memoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  memoryText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  createAlbumButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f8066",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  createAlbumButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
});
