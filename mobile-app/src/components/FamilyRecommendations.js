import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const RecommendationSection = ({ title, icon, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={24} color={theme.colors.primary} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {items.map((item, index) => (
        <View key={index} style={styles.recommendationItem}>
          <Text style={styles.recommendationText}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

export default function FamilyRecommendations({ recommendations }) {
  if (!recommendations) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="people-outline" size={24} color={theme.colors.primary} />
        <Text style={styles.title}>Recommandations familiales</Text>
      </View>

      <RecommendationSection
        title="Pour les enfants"
        icon="happy-outline"
        items={recommendations.children}
      />

      <RecommendationSection
        title="Préparation pratique"
        icon="checkmark-circle-outline"
        items={recommendations.practical_preparation}
      />

      <RecommendationSection
        title="Moments de détente"
        icon="leaf-outline"
        items={recommendations.relaxation}
      />

      <RecommendationSection
        title="Restauration"
        icon="restaurant-outline"
        items={recommendations.dining}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 