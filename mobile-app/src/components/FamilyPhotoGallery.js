import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Share,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 48) / 3;
const FULL_SCREEN_WIDTH = width;

export default function FamilyPhotoGallery({ 
  tripId, 
  photos = [], 
  onAddPhotos, 
  onDeletePhoto,
  onAddComment,
  onLikePhoto,
  familyMembers = []
}) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'mine', 'family'
  
  // Filtrer les photos selon l'onglet actif
  const filteredPhotos = photos.filter(photo => {
    if (activeTab === 'all') return true;
    if (activeTab === 'mine') return photo.uploadedBy === 'me';
    if (activeTab === 'family') return photo.uploadedBy !== 'me';
    return true;
  });

  const handlePhotoPress = (photo) => {
    setSelectedPhoto(photo);
    setIsFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
    setSelectedPhoto(null);
  };

  const handleAddPhotos = () => {
    if (onAddPhotos) {
      onAddPhotos(tripId);
    }
  };

  const handleDeletePhoto = () => {
    if (onDeletePhoto && selectedPhoto) {
      Alert.alert(
        "Supprimer la photo",
        "Êtes-vous sûr de vouloir supprimer cette photo ?",
        [
          { text: "Annuler", style: "cancel" },
          { 
            text: "Supprimer", 
            style: "destructive",
            onPress: () => {
              onDeletePhoto(tripId, selectedPhoto.id);
              handleCloseFullScreen();
            }
          }
        ]
      );
    }
  };

  const handleSharePhoto = async () => {
    if (selectedPhoto) {
      try {
        await Share.share({
          message: `Regarde cette photo de notre voyage à ${selectedPhoto.location || 'notre destination'} !`,
          url: selectedPhoto.uri
        });
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de partager la photo');
      }
    }
  };

  const handleAddComment = () => {
    if (comment.trim() && onAddComment && selectedPhoto) {
      setIsLoading(true);
      onAddComment(tripId, selectedPhoto.id, comment.trim())
        .then(() => {
          setComment('');
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          Alert.alert('Erreur', 'Impossible d\'ajouter le commentaire');
        });
    }
  };

  const handleLikePhoto = () => {
    if (onLikePhoto && selectedPhoto) {
      onLikePhoto(tripId, selectedPhoto.id);
    }
  };

  const renderPhotoItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.photoItem}
      onPress={() => handlePhotoPress(item)}
    >
      <Image source={{ uri: item.uri }} style={styles.photoThumbnail} />
      <View style={styles.photoInfo}>
        <Text style={styles.photoDate}>{item.date}</Text>
        <View style={styles.photoActions}>
          <Ionicons name="heart" size={16} color={item.liked ? theme.colors.primary : '#ccc'} />
          <Text style={styles.photoLikes}>{item.likes || 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFullScreenPhoto = () => (
    <Modal
      visible={isFullScreen}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCloseFullScreen}
    >
      <View style={styles.fullScreenContainer}>
        <View style={styles.fullScreenHeader}>
          <TouchableOpacity onPress={handleCloseFullScreen}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.fullScreenActions}>
            <TouchableOpacity onPress={handleLikePhoto} style={styles.actionButton}>
              <Ionicons 
                name={selectedPhoto?.liked ? "heart" : "heart-outline"} 
                size={24} 
                color={selectedPhoto?.liked ? theme.colors.primary : "#fff"} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSharePhoto} style={styles.actionButton}>
              <Ionicons name="share-social-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeletePhoto} style={styles.actionButton}>
              <Ionicons name="trash-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        
        <Image 
          source={{ uri: selectedPhoto?.uri }} 
          style={styles.fullScreenImage}
          resizeMode="contain"
        />
        
        <View style={styles.fullScreenFooter}>
          <View style={styles.photoDetails}>
            <Text style={styles.photoLocation}>{selectedPhoto?.location || 'Sans lieu'}</Text>
            <Text style={styles.photoDate}>{selectedPhoto?.date}</Text>
            <Text style={styles.photoUploader}>
              Par {selectedPhoto?.uploadedBy === 'me' ? 'vous' : selectedPhoto?.uploadedBy}
            </Text>
          </View>
          
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Commentaires</Text>
            {selectedPhoto?.comments && selectedPhoto.comments.length > 0 ? (
              <FlatList
                data={selectedPhoto.comments}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.commentItem}>
                    <Text style={styles.commentUser}>{item.user}</Text>
                    <Text style={styles.commentText}>{item.text}</Text>
                    <Text style={styles.commentDate}>{item.date}</Text>
                  </View>
                )}
                style={styles.commentsList}
              />
            ) : (
              <Text style={styles.noComments}>Aucun commentaire</Text>
            )}
            
            <View style={styles.addCommentContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Ajouter un commentaire..."
                value={comment}
                onChangeText={setComment}
                multiline
              />
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleAddComment}
                disabled={!comment.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="send" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Photos familiales</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPhotos}>
          <Ionicons name="camera" size={24} color={theme.colors.primary} />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            Toutes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'mine' && styles.activeTab]}
          onPress={() => setActiveTab('mine')}
        >
          <Text style={[styles.tabText, activeTab === 'mine' && styles.activeTabText]}>
            Mes photos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'family' && styles.activeTab]}
          onPress={() => setActiveTab('family')}
        >
          <Text style={[styles.tabText, activeTab === 'family' && styles.activeTabText]}>
            Famille
          </Text>
        </TouchableOpacity>
      </View>
      
      {filteredPhotos.length > 0 ? (
        <FlatList
          data={filteredPhotos}
          renderItem={renderPhotoItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          contentContainerStyle={styles.photosGrid}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Aucune photo</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={handleAddPhotos}>
            <Text style={styles.emptyButtonText}>Ajouter des photos</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {renderFullScreenPhoto()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    marginLeft: 4,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  photosGrid: {
    paddingBottom: 16,
  },
  photoItem: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
  },
  photoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4,
  },
  photoDate: {
    color: '#fff',
    fontSize: 10,
  },
  photoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoLikes: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  emptyButton: {
    marginTop: 16,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullScreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  fullScreenActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 16,
  },
  fullScreenImage: {
    width: FULL_SCREEN_WIDTH,
    height: FULL_SCREEN_WIDTH,
    alignSelf: 'center',
  },
  fullScreenFooter: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  photoDetails: {
    marginBottom: 16,
  },
  photoLocation: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  photoDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  photoUploader: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  commentsSection: {
    flex: 1,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  commentsList: {
    maxHeight: 200,
  },
  commentItem: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  commentUser: {
    fontWeight: '600',
    color: '#333',
  },
  commentText: {
    marginTop: 4,
    color: '#555',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  noComments: {
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: theme.colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 