import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TripMap } from './TripMap';
import { theme } from '../styles/theme';

const { width, height } = Dimensions.get('window');

export const FullMapModal = ({ visible, onClose, steps, initialRegion }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <TripMap 
          steps={steps}
          initialRegion={initialRegion}
          focusedStepIndex={0}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
}); 