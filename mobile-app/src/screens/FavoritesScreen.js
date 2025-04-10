import React from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  StyleSheet,
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');

const FavoriteTripCard = ({ trip, onPress }) => {
  return (
    <TouchableOpacity style={styles.tripCard} onPress={onPress}>
      <Image source={{ uri: trip.image_url }} style={styles.tripImage} />
      <View style={styles.tripInfo}>
        <View style={styles.tripHeader}>
          <Text style={styles.tripTitle}>{trip.title}</Text>
          <View style={styles.tripTypeContainer}>
            <Text style={styles.tripType}>{trip.type}</Text>
          </View>
        </View>
        <Text style={styles.tripDescription}>{trip.description}</Text>
        <View style={styles.tripFooter}>
          <View style={styles.tripDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{trip.duration}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{trip.familySize}</Text>
            </View>
          </View>
          <Text style={styles.tripPrice}>{trip.price}</Text>
        </View>
        <View style={styles.tagsContainer}>
          {trip.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function FavoritesScreen() {
  const navigation = useNavigation();

  const favorites = [
    {
      id: 1,
      title: "Costa Rica en famille",
      date: "15-30 Août 2024",
      image_url: "https://static1.evcdn.net/cdn-cgi/image/width=1400,height=1050,quality=70,fit=crop/offer/raw/2022/08/03/6d2d255d-c122-4ef7-99ab-80624f563bb6.jpg",
      progress: 60,
      description: "Découverte du Costa Rica en famille : volcans, plages paradisiaques et forêts tropicales",
      duration: "10 jours",
      type: "Circuit nature et plage",
      price: "3200€ / personne",
      priceDetails: "Vol + Hébergement + Transport",
      tags: ["Nature", "Plage", "Famille", "Aventure"],
      familySize: "2 adultes, 2 enfants"
    },
    {
      id: 2,
      title: "Séjour aux Maldives",
      date: "En cours de préparation",
      image_url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
      description: "Un paradis tropical pour toute la famille",
      duration: "10 jours",
      type: "Séjour balnéaire",
      price: "3500€ / personne",
      priceDetails: "Vol + Resort tout inclus",
      tags: ["Plage", "Luxe", "Relaxation", "Snorkeling"],
      familySize: "2 adultes, 1 enfant"
    },
    {
      id: 3,
      title: "Circuit Vietnam",
      date: "Avril 2023",
      image_url: "https://images.unsplash.com/photo-1557750255-c76072a7aad1",
      description: "Découverte du Vietnam en famille",
      duration: "14 jours",
      type: "Circuit culturel",
      price: "2800€ / personne",
      priceDetails: "Vol + Hébergement + Guide",
      tags: ["Culture", "Gastronomie", "Histoire", "Nature"],
      familySize: "2 adultes, 3 enfants"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Favoris</Text>
        <Text style={styles.subtitle}>{favorites.length} voyages sauvegardés</Text>
      </View>

      <ScrollView style={styles.content}>
        {favorites.length > 0 ? (
          favorites.map(trip => (
            <FavoriteTripCard
              key={trip.id}
              trip={trip}
              onPress={() => navigation.navigate('TripDetail', { trip })}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>Vous n'avez pas encore de favoris</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5ED',
  },
  header: {
    padding: 16,
    backgroundColor: '#F7F5ED',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  tripCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
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
  tripImage: {
    width: '100%',
    height: 200,
  },
  tripInfo: {
    padding: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  tripTypeContainer: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tripType: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  tripDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  tripPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
}); 