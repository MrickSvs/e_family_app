import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// Mock data pour le développement
let MOCK_PHOTOS = {
  'trip-1': [
    {
      id: '1',
      uri: 'https://images.unsplash.com/photo-1518183261945-b0989cfb3723',
      date: '15 Mars 2024',
      location: 'San José',
      uploadedBy: 'me',
      likes: 3,
      liked: true,
      comments: [
        { user: 'Maman', text: 'Super photo !', date: '15 Mars 2024' },
        { user: 'Papa', text: 'On s\'est bien amusés !', date: '15 Mars 2024' }
      ]
    },
    {
      id: '2',
      uri: 'https://images.unsplash.com/photo-1589308454676-21b1aa8b8c1c',
      date: '15 Mars 2024',
      location: 'San José',
      uploadedBy: 'Papa',
      likes: 2,
      liked: false,
      comments: [
        { user: 'Maman', text: 'Très belle vue !', date: '15 Mars 2024' }
      ]
    }
  ],
  'trip-2': [
    {
      id: '3',
      uri: 'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1',
      date: '16 Mars 2024',
      location: 'Arenal',
      uploadedBy: 'Maman',
      likes: 4,
      liked: true,
      comments: []
    }
  ]
};

// Mock family members
const MOCK_FAMILY_MEMBERS = [
  { id: '1', name: 'Maman' },
  { id: '2', name: 'Papa' },
  { id: '3', name: 'Sophie' },
  { id: '4', name: 'Thomas' }
];

class FamilyPhotoService {
  // Récupérer toutes les photos d'un voyage
  getPhotos(tripId) {
    return new Promise((resolve) => {
      // Simuler un délai réseau
      setTimeout(() => {
        resolve(MOCK_PHOTOS[tripId] || []);
      }, 500);
    });
  }

  // Récupérer les membres de la famille
  getFamilyMembers() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_FAMILY_MEMBERS);
      }, 300);
    });
  }

  // Ajouter des photos à un voyage
  async addPhotos(tripId) {
    try {
      // Demander la permission d'accéder à la galerie
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'Nous avons besoin de votre permission pour accéder à vos photos.'
        );
        return [];
      }

      // Ouvrir le sélecteur d'images
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 10,
      });

      if (result.canceled) {
        return [];
      }

      // Simuler l'upload des photos
      const newPhotos = result.assets.map((asset, index) => {
        const photoId = `new-${Date.now()}-${index}`;
        return {
          id: photoId,
          uri: asset.uri,
          date: new Date().toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          }),
          location: 'Non spécifié',
          uploadedBy: 'me',
          likes: 0,
          liked: false,
          comments: []
        };
      });

      // Ajouter les nouvelles photos au mock data
      if (!MOCK_PHOTOS[tripId]) {
        MOCK_PHOTOS[tripId] = [];
      }
      
      MOCK_PHOTOS[tripId] = [...MOCK_PHOTOS[tripId], ...newPhotos];

      return newPhotos;
    } catch (error) {
      console.error('Erreur lors de l\'ajout des photos:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter les photos');
      return [];
    }
  }

  // Supprimer une photo
  deletePhoto(tripId, photoId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (MOCK_PHOTOS[tripId]) {
          MOCK_PHOTOS[tripId] = MOCK_PHOTOS[tripId].filter(photo => photo.id !== photoId);
        }
        resolve(true);
      }, 500);
    });
  }

  // Ajouter un commentaire à une photo
  addComment(tripId, photoId, commentText) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (MOCK_PHOTOS[tripId]) {
          const photoIndex = MOCK_PHOTOS[tripId].findIndex(photo => photo.id === photoId);
          
          if (photoIndex !== -1) {
            const newComment = {
              user: 'me',
              text: commentText,
              date: new Date().toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })
            };
            
            if (!MOCK_PHOTOS[tripId][photoIndex].comments) {
              MOCK_PHOTOS[tripId][photoIndex].comments = [];
            }
            
            MOCK_PHOTOS[tripId][photoIndex].comments.push(newComment);
          }
        }
        resolve(true);
      }, 500);
    });
  }

  // Liker/Unliker une photo
  likePhoto(tripId, photoId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (MOCK_PHOTOS[tripId]) {
          const photoIndex = MOCK_PHOTOS[tripId].findIndex(photo => photo.id === photoId);
          
          if (photoIndex !== -1) {
            const photo = MOCK_PHOTOS[tripId][photoIndex];
            photo.liked = !photo.liked;
            
            if (photo.liked) {
              photo.likes = (photo.likes || 0) + 1;
            } else {
              photo.likes = Math.max(0, (photo.likes || 0) - 1);
            }
          }
        }
        resolve(true);
      }, 300);
    });
  }
}

export default new FamilyPhotoService(); 