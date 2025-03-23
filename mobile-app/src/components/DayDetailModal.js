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

export default function DayDetailModal({ visible, onClose, day, onSaveFeedback }) {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [photos, setPhotos] = useState(day?.memories?.photos || []);
  const [activityRatings, setActivityRatings] = useState(
    day?.program?.reduce((acc, activity) => ({
      ...acc,
      [activity.activity]: {
        rating: 0,
        feedback: '',
        photos: []
      }
    }), {}) || {}
  );
  const [accommodationRating, setAccommodationRating] = useState({
    rating: 0,
    feedback: '',
    photos: []
  });

  if (!day) return null;

  const handleSave = () => {
    onSaveFeedback({
      dayId: day.name,
      rating,
      feedback,
      photos,
      activityRatings,
      accommodationRating
    });
    setFeedback('');
    setRating(0);
    setActivityRatings({});
    setAccommodationRating({ rating: 0, feedback: '', photos: [] });
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

  const renderRatingStars = () => {
    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>Note globale de la journée :</Text>
        {renderStars(rating, setRating, 30)}
      </View>
    );
  };

  const renderActivityRating = (activity) => {
    const activityRating = activityRatings[activity.activity] || { rating: 0, feedback: '', photos: [] };
    
    return (
      <View key={activity.activity} style={styles.activityRatingContainer}>
        <View style={styles.activityRatingHeader}>
          <View style={styles.activityIconContainer}>
            <Ionicons name={activity.icon} size={20} color={theme.colors.primary} />
            <Text style={styles.activityRatingTime}>{activity.time}</Text>
          </View>
          <Text style={styles.activityRatingTitle}>{activity.activity}</Text>
        </View>
        {renderStars(
          activityRating.rating,
          (newRating) => setActivityRatings({
            ...activityRatings,
            [activity.activity]: {
              ...activityRating,
              rating: newRating
            }
          })
        )}
        <TextInput
          style={styles.activityFeedbackInput}
          placeholder="Commentaire sur cette activité (optionnel)"
          value={activityRating.feedback}
          onChangeText={(text) => setActivityRatings({
            ...activityRatings,
            [activity.activity]: {
              ...activityRating,
              feedback: text
            }
          })}
          multiline
        />
        {/* Photos de l'activité */}
        <View style={styles.photosGrid}>
          {activityRating.photos.map((photo, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri: photo }} style={styles.photoThumbnail} />
              <TouchableOpacity 
                style={styles.removePhotoButton}
                onPress={() => {
                  const newPhotos = [...activityRating.photos];
                  newPhotos.splice(index, 1);
                  setActivityRatings({
                    ...activityRatings,
                    [activity.activity]: {
                      ...activityRating,
                      photos: newPhotos
                    }
                  });
                }}
              >
                <Ionicons name="close-circle" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addPhotoButton}>
            <Ionicons name="camera" size={24} color={theme.colors.primary} />
            <Text style={styles.addPhotoText}>Ajouter</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{day.description}</Text>
            </View>

            {/* Programme du jour */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Programme</Text>
              {day.program.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <Ionicons name={activity.icon} size={20} color={theme.colors.primary} />
                  <Text style={styles.activityTime}>{activity.time}</Text>
                  <Text style={styles.activityText}>{activity.activity}</Text>
                </View>
              ))}
            </View>

            {/* Section feedback */}
            {(day.status === 'past' || day.status === 'current') && (
              <>
                {/* Note globale */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Votre feedback global</Text>
                  {renderRatingStars()}
                  <TextInput
                    style={styles.feedbackInput}
                    placeholder="Partagez votre expérience globale de cette journée..."
                    multiline
                    value={feedback}
                    onChangeText={setFeedback}
                  />
                  {/* Photos globales de la journée */}
                  <View style={styles.photosGrid}>
                    {photos.map((photo, index) => (
                      <View key={index} style={styles.photoContainer}>
                        <Image source={{ uri: photo }} style={styles.photoThumbnail} />
                        <TouchableOpacity 
                          style={styles.removePhotoButton}
                          onPress={() => {
                            const newPhotos = [...photos];
                            newPhotos.splice(index, 1);
                            setPhotos(newPhotos);
                          }}
                        >
                          <Ionicons name="close-circle" size={20} color="#FF3B30" />
                        </TouchableOpacity>
                      </View>
                    ))}
                    <TouchableOpacity style={styles.addPhotoButton}>
                      <Ionicons name="camera" size={24} color={theme.colors.primary} />
                      <Text style={styles.addPhotoText}>Ajouter</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Notes des activités */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Noter les activités</Text>
                  {day.program.map(activity => renderActivityRating(activity))}
                </View>

                {/* Note de l'hébergement */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Noter l'hébergement</Text>
                  <View style={styles.accommodationRatingContainer}>
                    {renderStars(
                      accommodationRating.rating,
                      (newRating) => setAccommodationRating({
                        ...accommodationRating,
                        rating: newRating
                      })
                    )}
                    <TextInput
                      style={styles.activityFeedbackInput}
                      placeholder="Commentaire sur l'hébergement (optionnel)"
                      value={accommodationRating.feedback}
                      onChangeText={(text) => setAccommodationRating({
                        ...accommodationRating,
                        feedback: text
                      })}
                      multiline
                    />
                    {/* Photos de l'hébergement */}
                    <View style={styles.photosGrid}>
                      {accommodationRating.photos.map((photo, index) => (
                        <View key={index} style={styles.photoContainer}>
                          <Image source={{ uri: photo }} style={styles.photoThumbnail} />
                          <TouchableOpacity 
                            style={styles.removePhotoButton}
                            onPress={() => {
                              const newPhotos = [...accommodationRating.photos];
                              newPhotos.splice(index, 1);
                              setAccommodationRating({
                                ...accommodationRating,
                                photos: newPhotos
                              });
                            }}
                          >
                            <Ionicons name="close-circle" size={20} color="#FF3B30" />
                          </TouchableOpacity>
                        </View>
                      ))}
                      <TouchableOpacity style={styles.addPhotoButton}>
                        <Ionicons name="camera" size={24} color={theme.colors.primary} />
                        <Text style={styles.addPhotoText}>Ajouter</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    (!feedback && !rating && 
                     !Object.values(activityRatings).some(r => r.rating > 0) && 
                     accommodationRating.rating === 0) && styles.saveButtonDisabled
                  ]}
                  onPress={handleSave}
                  disabled={!feedback && !rating && 
                          !Object.values(activityRatings).some(r => r.rating > 0) && 
                          accommodationRating.rating === 0}
                >
                  <Text style={styles.saveButtonText}>Enregistrer</Text>
                </TouchableOpacity>
              </>
            )}
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
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerDate: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  scrollContent: {
    flex: 1,
  },
  mainImageContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mainImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  mainImageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  mainImageDate: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityTime: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
    marginRight: 10,
    color: '#333',
  },
  activityText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  ratingContainer: {
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    padding: 5,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  photoContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    position: 'relative',
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
  },
  addPhotoButton: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  activityRatingContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  activityRatingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  activityRatingTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  activityRatingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  activityFeedbackInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
    minHeight: 60,
    fontSize: 14,
  },
  accommodationRatingContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
  },
}); 