import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import { theme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Mapping des emojis vers les icônes Ionicons
const iconMapping = {
  '⛵': 'boat-outline',
  '🍽️': 'restaurant-outline',
  '🛥️': 'boat-outline',
  '🏖️': 'sunny-outline',
  '🤿': 'water-outline',
  '🚶': 'walk-outline',
  '🏁': 'flag-outline',
  '🏨': 'bed-outline',
  '🍜': 'restaurant-outline',
  '🚲': 'bicycle-outline',
  '🎨': 'color-palette-outline',
  '🚢': 'boat-outline',
  '🦑': 'fish-outline',
  // Ajoutez d'autres mappings selon vos besoins
};

export const TripMap = ({ steps = [], initialRegion, focusedStepIndex = 0 }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && steps[focusedStepIndex]) {
      const { coordinate } = steps[focusedStepIndex];
      mapRef.current.animateToRegion({
        ...coordinate,
        latitudeDelta: 2,
        longitudeDelta: 2,
      }, 1000);
    }
  }, [focusedStepIndex, steps]);

  // Créer un tableau de coordonnées pour la ligne d'itinéraire
  const coordinates = steps?.map(step => step.coordinate) || [];

  // Fonction pour calculer la distance entre deux points
  const calculateDistance = (point1, point2) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calculer la distance totale
  let totalDistance = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    totalDistance += calculateDistance(coordinates[i], coordinates[i + 1]);
  }

  if (!steps || steps.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Aucune étape disponible</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
        zoomEnabled
        scrollEnabled
      >
        {/* Ligne d'itinéraire */}
        <Polyline
          coordinates={coordinates}
          strokeColor={theme.colors.primary}
          strokeWidth={3}
        />

        {/* Marqueurs pour chaque étape */}
        {steps.map((step, index) => (
          <Marker
            key={index}
            coordinate={step.coordinate}
            title={step.name}
            description={step.date}
          >
            <View style={[
              styles.markerContainer,
              index === focusedStepIndex && styles.markerContainerFocused,
              step.status === 'past' && styles.markerContainerPast,
              step.status === 'current' && styles.markerContainerCurrent,
              step.status === 'upcoming' && styles.markerContainerUpcoming,
            ]}>
              <Ionicons
                name={iconMapping[step.icon] || "location"}
                size={24}
                color={
                  index === focusedStepIndex
                    ? '#fff'
                    : step.status === 'past'
                    ? '#8E8E93'
                    : step.status === 'current'
                    ? '#fff'
                    : '#666'
                }
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Afficher la distance totale */}
      <View style={styles.distanceContainer}>
        <Ionicons name="map-outline" size={16} color={theme.colors.primary} />
        <Text style={styles.distanceText}>
          Distance totale : {Math.round(totalDistance)} km
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  markerContainerFocused: {
    backgroundColor: theme.colors.primary,
    transform: [{ scale: 1.2 }],
  },
  markerContainerPast: {
    borderColor: '#8E8E93',
    backgroundColor: '#fff',
  },
  markerContainerCurrent: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  markerContainerUpcoming: {
    borderColor: '#666',
    backgroundColor: '#fff',
  },
  distanceContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  distanceText: {
    fontSize: 14,
    color: theme.colors.text.dark,
    marginLeft: 4,
  },
  noDataText: {
    fontSize: 16,
    color: theme.colors.text.dark,
    textAlign: 'center',
    marginTop: 100,
  },
}); 