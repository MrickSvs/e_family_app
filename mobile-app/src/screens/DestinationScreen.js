import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

// Données mockées pour les itinéraires
const MOCK_ITINERARIES = {
  "Bali": [
    {
      id: 1,
      title: "Découverte de Bali en famille",
      duration: "10 jours",
      description: "Un voyage parfait pour découvrir les merveilles de Bali en famille, avec des activités adaptées aux enfants.",
      image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=60",
      price: "2 490€",
      tags: ["Famille", "Culture", "Plage"],
      recommendedPeriod: "Novembre - Février"
    },
    {
      id: 2,
      title: "Aventure à Bali",
      duration: "14 jours",
      description: "Un itinéraire aventureux pour explorer les sites naturels et culturels de Bali.",
      image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=60",
      price: "3 290€",
      tags: ["Aventure", "Nature", "Culture"],
      recommendedPeriod: "Novembre - Février"
    }
  ],
  "Thaïlande": [
    {
      id: 3,
      title: "Thaïlande en famille",
      duration: "12 jours",
      description: "Découvrez les temples, les plages et la culture thaïlandaise en famille.",
      image_url: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&auto=format&fit=crop&q=60",
      price: "2 890€",
      tags: ["Famille", "Culture", "Plage"],
      recommendedPeriod: "Novembre - Février"
    }
  ],
  "Japon": [
    {
      id: 4,
      title: "Japon traditionnel",
      duration: "15 jours",
      description: "Immersion dans la culture japonaise traditionnelle et moderne.",
      image_url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=60",
      price: "4 290€",
      tags: ["Culture", "Tradition", "Modernité"],
      recommendedPeriod: "Novembre - Février"
    }
  ],
  "Maroc": [
    {
      id: 5,
      title: "Maroc authentique",
      duration: "10 jours",
      description: "Découvrez les souks, les médinas et le désert marocain.",
      image_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=60",
      price: "1 990€",
      tags: ["Culture", "Désert", "Authenticité"],
      recommendedPeriod: "Novembre - Février"
    }
  ]
};

// Données mockées pour les experts locaux
const MOCK_EXPERTS = {
  "Bali": {
    name: "Made",
    image: "https://static1.evcdn.net/images/reduction/1649071_w-768_h-1024_q-70_m-crop.jpg",
    rating: 4.8,
    reviewCount: 127,
    experience: "8 ans",
    languages: ["Français", "Anglais", "Indonésien"],
    specialties: ["Voyages en famille", "Culture balinaise", "Aventure"],
    description: "Originaire de Bali, Made vous fera découvrir les secrets de son île natale. Spécialiste des voyages en famille, il saura adapter votre itinéraire pour créer des souvenirs inoubliables."
  }
};

export default function DestinationScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { destination } = route.params;
  const itineraries = MOCK_ITINERARIES[destination.name] || [];
  const [showExpertModal, setShowExpertModal] = useState(false);

  const handleCreateTrip = () => {
    navigation.navigate('TripDetail', {
      trip: {
        id: 'custom',
        title: `Voyage sur mesure à ${destination.name}`,
        description: "Créez votre voyage personnalisé avec l'aide d'un expert local",
        image_url: destination.image_url,
        duration: "À personnaliser",
        price: "À personnaliser",
        tags: ["Sur mesure", "Expert local", "Personnalisé"]
      },
      isPast: false,
      isCustomTrip: true
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{destination.name}</Text>
      </View>

      <ScrollView style={styles.content}>
        <Image 
          source={{ uri: destination.image_url }} 
          style={styles.coverImage}
        />
        
        <View style={styles.createTripSection}>
          <View style={styles.createTripContent}>
            <Text style={styles.createTripTitle}>Créez votre voyage sur mesure</Text>
            <Text style={styles.createTripDescription}>
              Découvrez {destination.name} à votre rythme avec un expert local qui vous guidera dans la création de votre voyage idéal.
            </Text>
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitItem}>
                <Ionicons name="person-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.benefitText}>Expert local dédié</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.benefitText}>Dates flexibles</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="heart-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.benefitText}>Expérience personnalisée</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.createTripButton}
              onPress={handleCreateTrip}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.createTripButtonText}>Créer mon voyage sur mesure</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.itinerariesSection}>
          <Text style={styles.sectionTitle}>Inspirations de voyages</Text>
          {itineraries.map((itinerary) => (
            <TouchableOpacity
              key={itinerary.id}
              style={styles.itineraryCard}
              onPress={() => navigation.navigate('TripDetail', { trip: itinerary, isPast: false })}
            >
              <Image
                source={{ uri: itinerary.image_url }}
                style={styles.itineraryImage}
              />
              <View style={styles.itineraryContent}>
                <Text style={styles.itineraryTitle}>{itinerary.title}</Text>
                <Text style={styles.itineraryDescription} numberOfLines={2}>
                  {itinerary.description}
                </Text>
                <View style={styles.itineraryDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
                    <Text style={styles.detailText}>{itinerary.duration}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="cash-outline" size={16} color={theme.colors.primary} />
                    <Text style={styles.detailText}>{itinerary.price}</Text>
                  </View>
                </View>
                <View style={styles.tagsContainer}>
                  {itinerary.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showExpertModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Créez votre voyage sur mesure</Text>
              <TouchableOpacity 
                onPress={() => setShowExpertModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDescription}>
              Un expert local vous contactera dans les 24h pour créer ensemble votre voyage idéal. Il vous proposera un itinéraire personnalisé adapté à vos envies et à votre budget.
            </Text>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={() => {
                setShowExpertModal(false);
                // Ici, vous pouvez ajouter la logique pour envoyer la demande à l'expert
              }}
            >
              <Text style={styles.confirmButtonText}>Je veux créer mon voyage sur mesure</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5ED',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  createTripSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  createTripContent: {
    backgroundColor: '#e2f4f0',
    borderRadius: 16,
    padding: 20,
  },
  createTripTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  createTripDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  benefitsContainer: {
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 8,
  },
  createTripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 12,
  },
  createTripButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  itinerariesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  itineraryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itineraryImage: {
    width: '100%',
    height: 160,
  },
  itineraryContent: {
    padding: 12,
  },
  itineraryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  itineraryDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  itineraryDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#e2f4f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  tagText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  modalDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
}); 