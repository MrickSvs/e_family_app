import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');
const MARKER_ANIMATION_DURATION = 500;

export const TripMap = ({ steps, initialRegion, focusedStepIndex }) => {
  const mapRef = useRef(null);
  const markerScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (focusedStepIndex !== undefined && mapRef.current) {
      const focusedStep = steps[focusedStepIndex];
      if (focusedStep) {
        // Animation du marqueur
        Animated.sequence([
          Animated.timing(markerScale, {
            toValue: 1.5,
            duration: MARKER_ANIMATION_DURATION,
            useNativeDriver: true,
          }),
          Animated.timing(markerScale, {
            toValue: 1,
            duration: MARKER_ANIMATION_DURATION,
            useNativeDriver: true,
          }),
        ]).start();

        // Centrage de la carte sur l'étape
        mapRef.current.animateToRegion({
          latitude: focusedStep.coordinate.latitude,
          longitude: focusedStep.coordinate.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }, 1000);
      }
    }
  }, [focusedStepIndex]);

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {steps.map((step, index) => (
          <Marker
            key={index}
            coordinate={step.coordinate}
            title={step.name}
            description={step.date}
          >
            <Animated.View style={[
              styles.marker,
              index === focusedStepIndex && {
                transform: [{ scale: markerScale }],
              },
              index === steps.length - 1 && styles.currentMarker
            ]} />
          </Marker>
        ))}
        
        <Polyline
          coordinates={steps.map(step => step.coordinate)}
          strokeColor={theme.colors.primary}
          strokeWidth={3}
        />
      </MapView>

      {/* Bouton de recentrage */}
      <TouchableOpacity 
        style={styles.recenterButton}
        onPress={handleRecenter}
      >
        <Ionicons name="expand-outline" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: width,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: 'white',
  },
  currentMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.secondary,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 