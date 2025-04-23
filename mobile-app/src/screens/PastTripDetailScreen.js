// src/screens/PastTripDetailScreen.js

import React, { useState, useEffect, useRef } from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Share,
  Modal,
  Animated,
  TextInput
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AgencyBlock from "../components/AgencyBlock";
import FamilyPhotoGallery from "../components/FamilyPhotoGallery";
import FamilyPhotoService from "../services/FamilyPhotoService";
import { theme } from "../styles/theme";
import { LinearGradient } from 'expo-linear-gradient';

const DEFAULT_COVER_IMAGE = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop";

export default function PastTripDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { trip } = route.params || {};
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [albumTheme, setAlbumTheme] = useState("classic");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadPhotos();
    loadFamilyMembers();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadFamilyMembers = async () => {
    // Mock data plus détaillée pour les membres de la famille
    setFamilyMembers([
      {
        id: 1,
        name: "Thomas",
        role: "Papa",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        rating: 4.5,
        comment: "Un voyage inoubliable ! Les enfants ont adoré la plage et les activités culturelles. Le seul bémol : un peu trop de monde à certains endroits.",
        highlights: ["Plage paradisiaque", "Restaurant local"],
        favoriteActivity: "Snorkeling en famille",
        photos: [1, 3, 5],
        emotions: ["😊", "🏖️", "👨‍👩‍👧‍👦"]
      },
      {
        id: 2,
        name: "Sophie",
        role: "Maman",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        rating: 5,
        comment: "Parfait équilibre entre détente et découverte. Les enfants ont appris beaucoup de choses sur la culture locale. Le guide était excellent !",
        highlights: ["Visite du musée", "Coucher de soleil"],
        favoriteActivity: "Cours de cuisine locale",
        photos: [2, 4, 6],
        emotions: ["🌟", "🍽️", "📚"]
      },
      {
        id: 3,
        name: "Lucas",
        role: "Fils",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        rating: 4,
        comment: "J'ai adoré nager avec les poissons ! Le parc aquatique était trop cool. J'ai fait plein de nouveaux copains !",
        highlights: ["Parc aquatique", "Plage"],
        favoriteActivity: "Snorkeling",
        photos: [1, 2, 3],
        emotions: ["🐠", "🏊‍♂️", "😎"]
      },
      {
        id: 4,
        name: "Emma",
        role: "Fille",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        rating: 5,
        comment: "C'était magique ! J'ai appris à faire de la paella et j'ai vu des dauphins. Je veux y retourner !",
        highlights: ["Dauphins", "Cours de cuisine"],
        favoriteActivity: "Observation des dauphins",
        photos: [4, 5, 6],
        emotions: ["🐬", "👩‍🍳", "✨"]
      }
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

  const handleCreateAlbum = () => {
    setShowAlbumModal(true);
  };

  const handleGenerateAlbum = async () => {
    try {
      // Simuler la génération de l'album
      const albumData = {
        title: albumTitle,
        description: albumDescription,
        theme: albumTheme,
        photos: selectedPhotos,
        familyReviews: familyMembers.map(member => ({
          memberName: member.name,
          rating: trip.rating,
          comment: member.comment || "Super voyage !"
        })),
        tripDetails: {
          title: trip.title,
          date: trip.date,
          rating: trip.rating,
          description: trip.description,
          memories: trip.memories
        }
      };

      // Simuler l'export de l'album
      await Share.share({
        message: `Album souvenir - ${albumTitle}\n\n${JSON.stringify(albumData, null, 2)}`,
        title: `Album souvenir - ${albumTitle}`
      });

      setShowAlbumModal(false);
    } catch (error) {
      console.error('Erreur lors de la création de l\'album:', error);
    }
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
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
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
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.familyReviewsContainer}
            >
              {familyMembers.map((member) => (
                <View key={member.id} style={styles.memberReviewCard}>
                  <View style={styles.memberHeader}>
                    <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberRole}>{member.role}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.ratingContainer}>
                    <View style={styles.starsContainer}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons
                          key={i}
                          name={i < Math.floor(member.rating) ? "star" : 
                                i === Math.floor(member.rating) && member.rating % 1 !== 0 ? "star-half" : "star-outline"}
                          size={16}
                          color="#FFD700"
                        />
                      ))}
                    </View>
                    <Text style={styles.ratingText}>{member.rating}/5</Text>
                  </View>

                  <Text style={styles.memberComment}>{member.comment}</Text>

                  <View style={styles.highlightsContainer}>
                    <Text style={styles.highlightsTitle}>Moments forts :</Text>
                    <View style={styles.highlightsList}>
                      {member.highlights.map((highlight, index) => (
                        <View key={index} style={styles.highlightItem}>
                          <Ionicons name="heart" size={12} color={theme.colors.primary} />
                          <Text style={styles.highlightText}>{highlight}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.emotionsContainer}>
                    {member.emotions.map((emotion, index) => (
                      <Text key={index} style={styles.emotion}>{emotion}</Text>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
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

          {/* Synthèse personnalisée */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Synthèse personnalisée</Text>
            <View style={styles.summaryCard}>
              <LinearGradient
                colors={['#f8f8f8', '#ffffff']}
                style={styles.summaryGradient}
              >
                <View style={styles.summaryHeader}>
                  <Ionicons name="analytics-outline" size={24} color={theme.colors.primary} />
                  <Text style={styles.summaryTitle}>Votre expérience</Text>
                </View>
                <View style={styles.summaryContent}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Durée du voyage</Text>
                    <Text style={styles.summaryValue}>{trip.duration || "7 jours"}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Activités préférées</Text>
                    <Text style={styles.summaryValue}>{trip.favoriteActivities?.join(", ") || "Plage, Culture"}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Moment fort</Text>
                    <Text style={styles.summaryValue}>{trip.highlight || "Coucher de soleil sur la plage"}</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Galerie photos avec sélection pour l'album */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Photos du voyage</Text>
              <TouchableOpacity 
                style={styles.createAlbumButton}
                onPress={handleCreateAlbum}
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
                selectable={true}
                onSelectPhotos={setSelectedPhotos}
                selectedPhotos={selectedPhotos}
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

        {/* Modal de création d'album */}
        <Modal
          visible={showAlbumModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Créer votre album souvenir</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Titre de l'album</Text>
                <TextInput
                  style={styles.input}
                  value={albumTitle}
                  onChangeText={setAlbumTitle}
                  placeholder="Mon album souvenir"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={albumDescription}
                  onChangeText={setAlbumDescription}
                  placeholder="Décrivez votre voyage..."
                  multiline
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Thème</Text>
                <View style={styles.themeSelector}>
                  {['classic', 'modern', 'minimal'].map((theme) => (
                    <TouchableOpacity
                      key={theme}
                      style={[
                        styles.themeOption,
                        albumTheme === theme && styles.themeOptionSelected
                      ]}
                      onPress={() => setAlbumTheme(theme)}
                    >
                      <Text style={[
                        styles.themeOptionText,
                        albumTheme === theme && styles.themeOptionTextSelected
                      ]}>
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowAlbumModal(false)}
                >
                  <Text style={styles.modalButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.generateButton]}
                  onPress={handleGenerateAlbum}
                >
                  <Text style={styles.modalButtonText}>Générer l'album</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Animated.View>
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
  familyReviewsContainer: {
    paddingVertical: 8,
    gap: 16,
  },
  memberReviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: 300,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  memberComment: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 12,
  },
  highlightsContainer: {
    marginBottom: 12,
  },
  highlightsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  highlightsList: {
    gap: 6,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  highlightText: {
    fontSize: 13,
    color: '#666',
  },
  emotionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  emotion: {
    fontSize: 20,
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
  container: {
    flex: 1,
  },
  summaryCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryGradient: {
    padding: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  summaryContent: {
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  themeOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  themeOptionText: {
    fontSize: 14,
    color: '#666',
  },
  themeOptionTextSelected: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  generateButton: {
    backgroundColor: theme.colors.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
