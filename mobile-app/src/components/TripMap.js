import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');

export const TripMap = ({ itinerary, style }) => {
  // Convertir les coordonnées de l'itinéraire en format pour la carte
  const coordinates = itinerary?.map(point => ({
    latitude: point.coordinate.latitude,
    longitude: point.coordinate.longitude,
  })) || [];

  // Calculer la région initiale pour centrer la carte
  const initialRegion = coordinates.length > 0
    ? {
        latitude: coordinates[0].latitude,
        longitude: coordinates[0].longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : null;

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
        {itinerary?.map((point, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: point.coordinate.latitude,
              longitude: point.coordinate.longitude,
            }}
            title={point.name}
            description={point.date}
            pinColor={index === 0 ? theme.colors.primary : theme.colors.secondary}
          />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 8,
  },
  map: {
    width: '100%',
    height: '100%',
  },
}); 