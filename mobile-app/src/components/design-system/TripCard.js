import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { theme } from '../../styles/theme';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = width - (CARD_MARGIN * 2);

export const TripCard = ({
  trip,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: trip.imageUrl }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>{trip.title}</Text>
          <Text style={styles.info}>
            {trip.duration} • {trip.type}
          </Text>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {trip.description}
        </Text>
        
        <View style={styles.tagContainer}>
          {trip.tags?.map((tag, index) => (
            <View 
              key={index} 
              style={[
                styles.tag,
                index % 2 === 0 ? styles.tagPrimary : styles.tagSecondary
              ]}
            >
              <Text 
                style={[
                  styles.tagText,
                  index % 2 === 0 ? styles.tagTextPrimary : styles.tagTextSecondary
                ]}
              >
                {tag}
              </Text>
            </View>
          ))}
        </View>

        {trip.price && (
          <View style={styles.priceContainer}>
            <Text style={styles.price}>À partir de {trip.price}€</Text>
            <Text style={styles.priceDetails}>par personne</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: CARD_MARGIN,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 24,
  },
  info: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 12,
  },
  tag: {
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagPrimary: {
    backgroundColor: '#E8F3F0',
  },
  tagSecondary: {
    backgroundColor: '#FFF9E0',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tagTextPrimary: {
    color: '#0F8066',
  },
  tagTextSecondary: {
    color: '#B3860B',
  },
  priceContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 2,
  },
  priceDetails: {
    fontSize: 14,
    color: '#666',
  },
});