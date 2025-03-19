import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AgencyBlock({ agency }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votre agence</Text>
      
      <View style={styles.agencyInfo}>
        <Image 
          source={{ uri: agency.imageUrl }} 
          style={styles.agencyImage} 
        />
        <View style={styles.textContainer}>
          <Text style={styles.agencyName}>{agency.name}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, i) => (
              <Ionicons
                key={i}
                name={i < agency.rating ? "star" : "star-outline"}
                size={16}
                color="#FFD700"
              />
            ))}
            <Text style={styles.reviewCount}>{agency.reviewCount} avis</Text>
          </View>
          <View style={styles.tags}>
            {agency.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Membre depuis</Text>
          <Text style={styles.detailValue}>{agency.memberSince}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Expérience</Text>
          <Text style={styles.detailValue}>{agency.experience}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Langues</Text>
          <Text style={styles.detailValue}>{agency.languages.join(', ')}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Basée à</Text>
          <Text style={styles.detailValue}>{agency.location}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  agencyInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  agencyImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  agencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewCount: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e2f4f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#0f8066',
  },
  details: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
}); 