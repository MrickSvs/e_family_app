import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CurrentTripDetailScreen = () => {
  const navigation = useNavigation();

  const tripData = {
    destination: 'Bali, Indonésie',
    dates: '15 Juin - 30 Juin 2024',
    participants: [
      { id: 1, name: 'Marie', role: 'Organisateur' },
      { id: 2, name: 'Thomas', role: 'Participant' },
      { id: 3, name: 'Sophie', role: 'Participant' },
    ],
    budget: {
      total: 5000,
      spent: 2500,
      remaining: 2500,
    },
    activities: [
      {
        id: 1,
        title: 'Visite des temples',
        date: '16 Juin',
        time: '09:00',
        location: 'Ubud',
      },
      {
        id: 2,
        title: 'Plongée',
        date: '18 Juin',
        time: '14:00',
        location: 'Nusa Penida',
      },
    ],
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Détails du voyage</Text>
      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );

  const renderDestinationCard = () => (
    <View style={styles.destinationCard}>
      <Image
        source={{ uri: 'https://source.unsplash.com/random/800x600/?bali' }}
        style={styles.destinationImage}
      />
      <View style={styles.destinationInfo}>
        <Text style={styles.destinationTitle}>{tripData.destination}</Text>
        <Text style={styles.destinationDates}>{tripData.dates}</Text>
      </View>
    </View>
  );

  const renderBudgetCard = () => (
    <View style={styles.budgetCard}>
      <Text style={styles.sectionTitle}>Budget</Text>
      <View style={styles.budgetGrid}>
        <View style={styles.budgetItem}>
          <Text style={styles.budgetLabel}>Total</Text>
          <Text style={styles.budgetValue}>{tripData.budget.total}€</Text>
        </View>
        <View style={styles.budgetItem}>
          <Text style={styles.budgetLabel}>Dépensé</Text>
          <Text style={[styles.budgetValue, styles.spentValue]}>
            {tripData.budget.spent}€
          </Text>
        </View>
        <View style={styles.budgetItem}>
          <Text style={styles.budgetLabel}>Restant</Text>
          <Text style={[styles.budgetValue, styles.remainingValue]}>
            {tripData.budget.remaining}€
          </Text>
        </View>
      </View>
    </View>
  );

  const renderParticipants = () => (
    <View style={styles.participantsCard}>
      <Text style={styles.sectionTitle}>Participants</Text>
      <View style={styles.participantsList}>
        {tripData.participants.map((participant) => (
          <View key={participant.id} style={styles.participantItem}>
            <View style={styles.participantAvatar}>
              <Text style={styles.participantInitial}>
                {participant.name[0]}
              </Text>
            </View>
            <View style={styles.participantInfo}>
              <Text style={styles.participantName}>{participant.name}</Text>
              <Text style={styles.participantRole}>{participant.role}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderActivities = () => (
    <View style={styles.activitiesCard}>
      <Text style={styles.sectionTitle}>Activités prévues</Text>
      {tripData.activities.map((activity) => (
        <TouchableOpacity key={activity.id} style={styles.activityItem}>
          <View style={styles.activityTime}>
            <Text style={styles.activityDate}>{activity.date}</Text>
            <Text style={styles.activityHour}>{activity.time}</Text>
          </View>
          <View style={styles.activityInfo}>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.activityLocation}>{activity.location}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.scrollView}>
        {renderDestinationCard()}
        {renderBudgetCard()}
        {renderParticipants()}
        {renderActivities()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  backButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  destinationCard: {
    margin: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  destinationImage: {
    width: '100%',
    height: 200,
  },
  destinationInfo: {
    padding: 16,
  },
  destinationTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  destinationDates: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  budgetCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  budgetGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetItem: {
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  spentValue: {
    color: '#FF6B6B',
  },
  remainingValue: {
    color: '#4CAF50',
  },
  participantsCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  participantsList: {
    gap: 12,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  participantInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '500',
  },
  participantRole: {
    fontSize: 14,
    color: '#666',
  },
  activitiesCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  activityTime: {
    width: 80,
    marginRight: 16,
  },
  activityDate: {
    fontSize: 14,
    color: '#666',
  },
  activityHour: {
    fontSize: 16,
    fontWeight: '500',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityLocation: {
    fontSize: 14,
    color: '#666',
  },
});

export default CurrentTripDetailScreen; 