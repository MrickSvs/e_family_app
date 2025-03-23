import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  Animated 
} from 'react-native';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');
const TIMELINE_DOT_SIZE = 12;
const TIMELINE_LINE_WIDTH = 2;

export const TripTimeline = ({ steps, onStepPress, focusedStepIndex }) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.timelineItem}
          onPress={() => onStepPress(index)}
          activeOpacity={0.7}
        >
          {/* Timeline line and dot */}
          <View style={styles.timelineColumn}>
            <View style={[
              styles.timelineDot,
              index === focusedStepIndex && styles.timelineDotFocused
            ]} />
            {index < steps.length - 1 && <View style={styles.timelineLine} />}
          </View>

          {/* Content */}
          <View style={[
            styles.contentContainer,
            index === focusedStepIndex && styles.contentContainerFocused
          ]}>
            <Text style={[
              styles.date,
              index === focusedStepIndex && styles.dateFocused
            ]}>{step.date}</Text>
            <Text style={[
              styles.location,
              index === focusedStepIndex && styles.locationFocused
            ]}>{step.name}</Text>
            
            {step.imageUrl && (
              <Image 
                source={{ uri: step.imageUrl }} 
                style={[
                  styles.image,
                  index === focusedStepIndex && styles.imageFocused
                ]}
                resizeMode="cover"
              />
            )}
            
            {step.description && (
              <Text style={[
                styles.description,
                index === focusedStepIndex && styles.descriptionFocused
              ]}>{step.description}</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineColumn: {
    width: TIMELINE_DOT_SIZE,
    alignItems: 'center',
  },
  timelineDot: {
    width: TIMELINE_DOT_SIZE,
    height: TIMELINE_DOT_SIZE,
    borderRadius: TIMELINE_DOT_SIZE / 2,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: 'white',
  },
  timelineDotFocused: {
    width: TIMELINE_DOT_SIZE * 1.5,
    height: TIMELINE_DOT_SIZE * 1.5,
    borderRadius: (TIMELINE_DOT_SIZE * 1.5) / 2,
    backgroundColor: theme.colors.secondary,
    borderWidth: 3,
  },
  timelineLine: {
    width: TIMELINE_LINE_WIDTH,
    flex: 1,
    backgroundColor: theme.colors.primary,
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainerFocused: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#fff',
    transform: [{ scale: 1.02 }],
  },
  date: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateFocused: {
    color: theme.colors.secondary,
  },
  location: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  locationFocused: {
    color: '#000',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginVertical: 8,
  },
  imageFocused: {
    height: 250,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  descriptionFocused: {
    color: '#333',
  },
}); 