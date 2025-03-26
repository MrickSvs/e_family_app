import React from 'react';
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
  // Ajoutez d'autres mappings selon vos besoins
};

export const TripMap = ({ itinerary, style, showFamilyTips = true }) => {
  // Convertir les coordonnées des points en format pour la carte
  const coordinates = itinerary?.points?.map(point => ({
    latitude: point.coordinate.latitude,
    longitude: point.coordinate.longitude,
  })) || [];

  // Calculer la région initiale pour englober tous les points
  const initialRegion = coordinates.length > 0
    ? {
        latitude: coordinates.reduce((sum, coord) => sum + coord.latitude, 0) / coordinates.length,
        longitude: coordinates.reduce((sum, coord) => sum + coord.longitude, 0) / coordinates.length,
        latitudeDelta: Math.max(
          ...coordinates.map(coord => Math.abs(coord.latitude - coordinates[0].latitude))
        ) * 2.5,
        longitudeDelta: Math.max(
          ...coordinates.map(coord => Math.abs(coord.longitude - coordinates[0].longitude))
        ) * 2.5,
      }
    : null;

  // Fonction pour obtenir le nom de l'icône Ionicons à partir d'un emoji
  const getIconName = (emoji) => {
    return iconMapping[emoji] || 'time-outline'; // Icône par défaut si l'emoji n'est pas mappé
  };

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

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
        zoomEnabled
        scrollEnabled
      >
        {/* Afficher les marqueurs pour chaque point de l'itinéraire */}
        {itinerary?.points?.map((point, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: point.coordinate.latitude,
              longitude: point.coordinate.longitude,
            }}
            title={`Jour ${point.day} - ${point.title}`}
            description={point.description}
            pinColor={index === 0 ? theme.colors.primary : theme.colors.secondary}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>Jour {point.day} - {point.title}</Text>
                <Text style={styles.calloutDescription}>{point.description}</Text>
                {point.steps && point.steps.length > 0 && (
                  <View style={styles.stepsContainer}>
                    <Text style={styles.stepsTitle}>Programme du jour :</Text>
                    {point.steps.map((step, stepIndex) => (
                      <View key={stepIndex} style={styles.stepItem}>
                        <Ionicons 
                          name={getIconName(step.icon)} 
                          size={16} 
                          color={theme.colors.primary} 
                        />
                        <Text style={styles.stepText}>{step.time} - {step.activity}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Afficher la ligne de l'itinéraire */}
        {coordinates.length > 1 && (
          <Polyline
            coordinates={coordinates}
            strokeColor={theme.colors.primary}
            strokeWidth={3}
          />
        )}
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
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  calloutContainer: {
    padding: 8,
    maxWidth: 250,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.dark,
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 14,
    color: theme.colors.text.medium,
    marginBottom: 8,
  },
  stepsContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.dark,
    marginBottom: 4,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepText: {
    fontSize: 12,
    color: theme.colors.text.medium,
    marginLeft: 4,
    flex: 1,
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
}); 