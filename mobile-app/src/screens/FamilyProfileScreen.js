import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { FamilyProfileEditor } from '../components/FamilyProfileEditor';
import { api } from '../services/api';

export const FamilyProfileScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { memberId } = route.params;
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMemberProfile();
  }, [memberId]);

  const loadMemberProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/family/member/${memberId}`);
      setMember(response.data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger le profil');
      Alert.alert(
        'Erreur',
        'Impossible de charger le profil. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      setLoading(true);
      await api.put(`/family/member/${memberId}`, formData);
      Alert.alert(
        'Succès',
        'Le profil a été mis à jour avec succès.',
        [{ text: 'OK' }]
      );
      // Recharger les données pour afficher les modifications
      await loadMemberProfile();
    } catch (err) {
      Alert.alert(
        'Erreur',
        'Impossible de sauvegarder les modifications. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>Une erreur est survenue lors du chargement du profil.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FamilyProfileEditor
        member={member}
        onSave={handleSave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
