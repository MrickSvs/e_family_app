import React, { useState, useEffect, useCallback } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { getFamilyInfo } from '../services/familyService';

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

const FamilyMemberSelector = ({ members, selectedMember, onSelectMember, firstAdult }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.memberSelector}
      contentContainerStyle={styles.memberSelectorContent}
    >
      {firstAdult && (
        <TouchableOpacity 
          style={[
            styles.memberButton, 
            selectedMember === firstAdult.id && styles.memberButtonActive
          ]} 
          onPress={() => onSelectMember(firstAdult.id)}
        >
          <Ionicons 
            name="person-circle-outline" 
            size={24} 
            color={selectedMember === firstAdult.id ? '#fff' : '#666'} 
          />
          <Text style={[
            styles.memberButtonText,
            selectedMember === firstAdult.id && styles.memberButtonTextActive
          ]}>{firstAdult.name}</Text>
        </TouchableOpacity>
      )}
      
      {members.map((member) => (
        <TouchableOpacity 
          key={member.id}
          style={[
            styles.memberButton, 
            selectedMember === member.id && styles.memberButtonActive
          ]} 
          onPress={() => onSelectMember(member.id)}
        >
          <Ionicons 
            name="person-circle-outline" 
            size={24} 
            color={selectedMember === member.id ? '#fff' : '#666'} 
          />
          <Text style={[
            styles.memberButtonText,
            selectedMember === member.id && styles.memberButtonTextActive
          ]}>{member.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const [selectedMember, setSelectedMember] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [firstAdult, setFirstAdult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadFamilyData();
    }, [])
  );

  const loadFamilyData = async () => {
    try {
      setLoading(true);
      const familyInfo = await getFamilyInfo();
      
      if (familyInfo && familyInfo.members) {
        const adults = familyInfo.members.filter(member => member.role === 'Adulte');
        const firstAdultMember = adults.length > 0 ? adults[0] : null;
        
        const formattedMembers = familyInfo.members
          .filter(member => member.id !== firstAdultMember?.id)
          .map(member => ({
            id: member.id.toString(),
            name: member.first_name
          }));
        
        setFamilyMembers(formattedMembers);
        
        if (firstAdultMember) {
          const formattedFirstAdult = {
            id: firstAdultMember.id.toString(),
            name: firstAdultMember.first_name
          };
          setFirstAdult(formattedFirstAdult);
          setSelectedMember(formattedFirstAdult.id);
        }
      }
    } catch (err) {
      console.error('Error loading family data:', err);
      setError('Impossible de charger les données de la famille');
    } finally {
      setLoading(false);
    }
  };

  const favoritesByMember = {
    // Les favoris seront ajoutés dynamiquement pour chaque membre
  };

  if (firstAdult) {
    favoritesByMember[firstAdult.id] = [
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
      }
    ];
  }

  familyMembers.forEach(member => {
    if (!favoritesByMember[member.id]) {
      favoritesByMember[member.id] = [];
    }
  });

  const currentFavorites = selectedMember ? favoritesByMember[selectedMember] || [] : [];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Chargement des membres de la famille...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadFamilyData}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoris</Text>
        <Text style={styles.subtitle}>
          {selectedMember === firstAdult?.id
            ? `${currentFavorites.length} voyages sauvegardés` 
            : `Favoris de ${familyMembers.find(m => m.id === selectedMember)?.name || ''}`}
        </Text>
      </View>

      <FamilyMemberSelector 
        members={familyMembers}
        selectedMember={selectedMember}
        onSelectMember={setSelectedMember}
        firstAdult={firstAdult}
      />

      <ScrollView style={styles.content}>
        {currentFavorites.length > 0 ? (
          currentFavorites.map(trip => (
            <FavoriteTripCard
              key={trip.id}
              trip={trip}
              onPress={() => navigation.navigate('TripDetail', { trip })}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>
              {selectedMember === firstAdult?.id
                ? "Vous n'avez pas encore de favoris" 
                : `${familyMembers.find(m => m.id === selectedMember)?.name || ''} n'a pas encore de favoris`}
            </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  memberSelector: {
    maxHeight: 80,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  memberSelectorContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  memberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  memberButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  memberButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  memberButtonTextActive: {
    color: '#fff',
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
    textAlign: 'center',
  },
}); 