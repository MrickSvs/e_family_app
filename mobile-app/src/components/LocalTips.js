import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

export const LocalTips = ({ familyProfile, destination }) => {
  // Données mockées pour les conseils locaux
  const tips = {
    restaurants: [
      {
        title: "Restaurants adaptés aux enfants",
        description: "Liste des restaurants avec menus enfants et espace de jeux",
        icon: "restaurant-outline"
      },
      {
        title: "Pique-nique en famille",
        description: "Les meilleurs spots pour pique-niquer avec les enfants",
        icon: "basket-outline"
      }
    ],
    activités: [
      {
        title: "Parcs et jardins",
        description: "Les plus beaux parcs pour les enfants",
        icon: "leaf-outline"
      },
      {
        title: "Musées interactifs",
        description: "Musées adaptés aux enfants avec des activités ludiques",
        icon: "museum-outline"
      }
    ],
    transport: [
      {
        title: "Transport en famille",
        description: "Les meilleures options de transport avec des enfants",
        icon: "bus-outline"
      }
    ],
    santé: [
      {
        title: "Pharmacies et hôpitaux",
        description: "Les établissements médicaux à proximité",
        icon: "medical-outline"
      }
    ]
  };

  const renderTipSection = (title, tips, icon) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={24} color={theme.colors.primary} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {tips.map((tip, index) => (
        <TouchableOpacity key={index} style={styles.tipCard}>
          <Text style={styles.tipTitle}>{tip.title}</Text>
          <Text style={styles.tipDescription}>{tip.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>Conseils locaux pour votre famille</Text>
      <Text style={styles.subtitle}>Adaptés à votre profil familial</Text>

      {renderTipSection("Restaurants", tips.restaurants, "restaurant-outline")}
      {renderTipSection("Activités", tips.activités, "game-controller-outline")}
      {renderTipSection("Transport", tips.transport, "bus-outline")}
      {renderTipSection("Santé", tips.santé, "medical-outline")}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  tipCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 