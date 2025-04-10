import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 48) / 3;

// Photos mockées pour chaque destination
const MOCK_PHOTOS = {
  "San José": [
    "https://images.unsplash.com/photo-1518183261945-b0989cfb3723",
    "https://images.unsplash.com/photo-1589308454676-21b1aa8b8c1c",
    "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5"
  ],
  "Arenal": [
    "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1",
    "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5",
    "https://images.unsplash.com/photo-1518183261945-b0989cfb3723"
  ],
  "Manuel Antonio": [
    "https://images.unsplash.com/photo-1589308454676-21b1aa8b8c1c",
    "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5",
    "https://images.unsplash.com/photo-1518183261945-b0989cfb3723"
  ],
  "Tamarindo": [
    "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5",
    "https://images.unsplash.com/photo-1518183261945-b0989cfb3723",
    "https://images.unsplash.com/photo-1589308454676-21b1aa8b8c1c"
  ]
};

export default function DayDetailModal({ visible, onClose, day, onSaveFeedback }) {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [photos, setPhotos] = useState(MOCK_PHOTOS[day?.name] || []);
  const [highlight, setHighlight] = useState('');

  if (!day) return null;

  const handleSave = () => {
    onSaveFeedback({
      dayId: day.name,
      rating,
      feedback,
      photos,
      highlight
    });
    setFeedback('');
    setRating(0);
    setHighlight('');
  };

  const renderStars = (currentRating, onRatingChange, size = 24) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onRatingChange(star)}
            style={styles.starButton}
          >
            <Ionicons
              name={star <= currentRating ? 'star' : 'star-outline'}
              size={size}
              color={star <= currentRating ? theme.colors.primary : '#ccc'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderPastDayContent = () => (
    <>
      {/* Photos du jour */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos du jour</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.photosScroll}
        >
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri: photo }} style={styles.photoThumbnail} />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Moment préféré */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Moment préféré de la journée</Text>
        <TextInput
          style={styles.highlightInput}
          placeholder="Quel a été votre moment préféré aujourd'hui ?"
          value={highlight}
          onChangeText={setHighlight}
          multiline
        />
      </View>

      {/* Note globale */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Note globale</Text>
        <View style={styles.ratingContainer}>
          {renderStars(rating, setRating, 30)}
        </View>
      </View>

      {/* Commentaires */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Commentaires</Text>
        <TextInput
          style={styles.feedbackInput}
          placeholder="Partagez vos impressions sur cette journée..."
          value={feedback}
          onChangeText={setFeedback}
          multiline
        />
      </View>

      {/* Bouton de sauvegarde */}
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Enregistrer</Text>
      </TouchableOpacity>
    </>
  );

  const renderCurrentDayContent = () => (
    <>
      {/* Photos du jour */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos du jour</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.photosScroll}
        >
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri: photo }} style={styles.photoThumbnail} />
            </View>
          ))}
          <TouchableOpacity style={styles.addPhotoButton}>
            <Ionicons name="camera" size={24} color={theme.colors.primary} />
            <Text style={styles.addPhotoText}>Ajouter</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Moment préféré */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Moment préféré de la journée</Text>
        <TextInput
          style={styles.highlightInput}
          placeholder="Quel a été votre moment préféré aujourd'hui ?"
          value={highlight}
          onChangeText={setHighlight}
          multiline
        />
      </View>

      {/* Note globale */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Note globale</Text>
        <View style={styles.ratingContainer}>
          {renderStars(rating, setRating, 30)}
        </View>
      </View>

      {/* Commentaires */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Commentaires</Text>
        <TextInput
          style={styles.feedbackInput}
          placeholder="Partagez vos impressions sur cette journée..."
          value={feedback}
          onChangeText={setFeedback}
          multiline
        />
      </View>

      {/* Bouton de sauvegarde */}
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Enregistrer</Text>
      </TouchableOpacity>
    </>
  );

  const renderUpcomingDayContent = () => (
    <>
      {/* Conseils pour la journée */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conseils pour la journée</Text>
        <View style={styles.tipsContainer}>
          <View style={styles.tipItem}>
            <Ionicons name="sunny-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.tipText}>Pensez à prendre de la crème solaire</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="water-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.tipText}>Emportez de l'eau en quantité</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="camera-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.tipText}>N'oubliez pas votre appareil photo</Text>
          </View>
        </View>
      </View>

      {/* Météo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Météo prévue</Text>
        <View style={styles.weatherContainer}>
          <View style={styles.weatherItem}>
            <Ionicons name="thermometer-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.weatherText}>28°C</Text>
          </View>
          <View style={styles.weatherItem}>
            <Ionicons name="rainy-outline" size={24} color={theme.colors.primary} />
            <Text style={styles.weatherText}>20% de pluie</Text>
          </View>
        </View>
      </View>

      {/* Points d'intérêt à proximité */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Points d'intérêt à proximité</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.pointsScroll}
        >
          {[1, 2, 3].map((_, index) => (
            <View key={index} style={styles.pointCard}>
              <Image 
                source={{ uri: photos[index] }} 
                style={styles.pointImage}
              />
              <Text style={styles.pointTitle}>Point d'intérêt {index + 1}</Text>
              <Text style={styles.pointDistance}>à 2.5 km</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{day.name}</Text>
            <Text style={styles.headerDate}>{day.date}</Text>
          </View>

          <ScrollView style={styles.scrollContent}>
            {/* Image principale du jour */}
            <View style={styles.mainImageContainer}>
              <Image source={{ uri: day.imageUrl }} style={styles.mainImage} />
              <View style={styles.mainImageOverlay}>
                <Text style={styles.mainImageTitle}>{day.name}</Text>
                <Text style={styles.mainImageDate}>{day.date}</Text>
              </View>
            </View>

            {/* Programme du jour */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Programme du jour</Text>
              {day.program.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <Ionicons name={activity.icon} size={20} color={theme.colors.primary} />
                  <Text style={styles.activityTime}>{activity.time}</Text>
                  <Text style={styles.activityText}>{activity.activity}</Text>
                </View>
              ))}
            </View>

            {/* Contenu spécifique selon le statut */}
            {day.status === 'past' && renderPastDayContent()}
            {day.status === 'current' && renderCurrentDayContent()}
            {day.status === 'upcoming' && renderUpcomingDayContent()}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    flex: 1,
  },
  headerDate: {
    fontSize: 14,
    color: '#666',
  },
  scrollContent: {
    flex: 1,
  },
  mainImageContainer: {
    height: 200,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  mainImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  mainImageTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  mainImageDate: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#F7F5ED',
    padding: 12,
    borderRadius: 8,
  },
  activityTime: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 16,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
  },
  photosScroll: {
    flexDirection: 'row',
  },
  photoContainer: {
    marginRight: 8,
  },
  photoThumbnail: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  highlightInput: {
    backgroundColor: '#F7F5ED',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  ratingContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    padding: 4,
  },
  feedbackInput: {
    backgroundColor: '#F7F5ED',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Nouveaux styles pour les jours à venir
  tipsContainer: {
    backgroundColor: '#F7F5ED',
    borderRadius: 8,
    padding: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },
  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F7F5ED',
    borderRadius: 8,
    padding: 16,
  },
  weatherItem: {
    alignItems: 'center',
  },
  weatherText: {
    marginTop: 4,
    fontSize: 14,
    color: '#333',
  },
  pointsScroll: {
    flexDirection: 'row',
  },
  pointCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: '#F7F5ED',
    borderRadius: 8,
    overflow: 'hidden',
  },
  pointImage: {
    width: '100%',
    height: 100,
  },
  pointTitle: {
    padding: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  pointDistance: {
    padding: 8,
    paddingTop: 0,
    fontSize: 12,
    color: '#666',
  },
  // Styles pour le bouton d'ajout de photo
  addPhotoButton: {
    width: 120,
    height: 120,
    backgroundColor: '#F7F5ED',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addPhotoText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 4,
  },
}); 