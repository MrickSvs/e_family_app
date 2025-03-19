import React, { useState, useEffect } from "react";
import { SafeAreaView, View, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, ActivityIndicator, Platform, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProfile, updateFamilyProfile, updateMemberProfile, addFamilyMember, deleteFamilyMember } from '../services/profileService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { InfoMessage } from "../components/design-system";
import { theme } from "../styles/theme";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProfile();
      console.log("Profile data received:", response);
      if (!response) {
        throw new Error('No profile data received');
      }
      setProfile(response);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError('Impossible de charger le profil');
      Alert.alert(
        'Erreur',
        'Impossible de charger le profil. Veuillez réessayer plus tard.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContainer]}>
        <InfoMessage
          variant="error"
          message={`Une erreur est survenue: ${error}`}
        />
        <Text
          variant="body"
          color="primary"
          style={styles.retryText}
          onPress={loadProfile}
        >
          Réessayer
        </Text>
      </SafeAreaView>
    );
  }

  const handleFamilyNameUpdate = async (newName) => {
    try {
      const updatedProfile = await updateFamilyProfile({
        family_name: newName
      });
      setProfile(prev => ({ ...prev, family_name: updatedProfile.family_name }));
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le nom de famille');
    }
  };

  const handleMemberEdit = (member) => {
    setEditingMember(member);
    setShowEditMemberModal(true);
  };

  const handleMemberUpdate = async (memberId, data) => {
    try {
      const updateData = {
        first_name: data.first_name,
        last_name: data.last_name,
        birth_date: data.birth_date,
        role: data.role
      };

      const updatedMember = await updateMemberProfile(memberId, updateData);
      setProfile(prev => ({
        ...prev,
        members: prev.members.map(m => m.id === memberId ? updatedMember : m)
      }));
      setShowEditMemberModal(false);
      setEditingMember(null);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du membre:", error);
      let errorMessage = "Impossible de mettre à jour le membre";
      
      try {
        const parsedError = JSON.parse(error.message);
        if (parsedError.errors) {
          errorMessage = parsedError.errors.map(err => `${err.field}: ${err.message}`).join('\n');
        }
      } catch (e) {
        errorMessage = error.message;
      }
      
      Alert.alert('Erreur', errorMessage);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEditingMember(prev => ({
        ...prev,
        birth_date: selectedDate.toISOString()
      }));
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const response = await updateFamilyProfile(updatedData);
      setProfile(response);
      setEditingProfile(false);
      Alert.alert('Succès', 'Profil mis à jour avec succès');
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={{ color: '#333', fontSize: 24, fontWeight: 'bold' }}>
            Mon Profil
          </Text>
          <View style={styles.yellowDot} />
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditMode(!editMode)}
        >
          <MaterialIcons 
            name={editMode ? "done" : "edit"} 
            size={24} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={{ color: '#333', fontSize: 20, fontWeight: 'bold' }}>
              Informations Famille
            </Text>
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nom de famille</Text>
              <Text style={styles.infoValue}>{profile?.family_name || 'Profil famille'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Composition</Text>
              <Text style={styles.infoValue}>
                {profile?.adults} adulte{profile?.adults > 1 ? 's' : ''}, {profile?.children} enfant{profile?.children > 1 ? 's' : ''}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Âges des enfants</Text>
              <Text style={styles.infoValue}>
                {profile?.ages?.join(', ') || 'Non renseigné'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Budget</Text>
              <Text style={styles.infoValue}>{profile?.budget || 'Non renseigné'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type de voyage</Text>
              <Text style={styles.infoValue}>
                {profile?.travel_type?.join(', ') || 'Non renseigné'}
              </Text>
            </View>
          </View>

          {editMode && (
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => setEditingProfile(true)}
            >
              <Text style={styles.editProfileButtonText}>Modifier les informations</Text>
            </TouchableOpacity>
          )}
        </View>

        {profile?.members && profile.members.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={{ color: '#333', fontSize: 20, fontWeight: 'bold' }}>
                  Membres de la famille
                </Text>
                <Text style={{ color: '#666', fontSize: 16 }}>
                  {profile.members.length} membre{profile.members.length > 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            <View style={styles.membersContainer}>
              {profile.members.map((member) => (
                <View key={member.id} style={styles.memberCard}>
                  <View style={styles.memberHeader}>
                    <View style={styles.memberInfo}>
                      <Text style={{ color: '#333', fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
                        {member.first_name} {member.last_name}
                      </Text>
                      <View style={styles.memberDetails}>
                        <Text style={{ color: '#666', fontSize: 16 }}>
                          {member.role}
                        </Text>
                        {member.birth_date && (
                          <Text style={{ color: '#666', fontSize: 16, marginLeft: 4 }}>
                            • {new Date(member.birth_date).toLocaleDateString()}
                          </Text>
                        )}
                      </View>
                    </View>
                    {editMode && (
                      <View style={styles.memberActions}>
                        <TouchableOpacity
                          style={styles.editMemberButton}
                          onPress={() => handleMemberEdit(member)}
                        >
                          <MaterialIcons name="edit" size={20} color={theme.colors.primary} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={{ color: '#666', fontSize: 16, textAlign: 'center' }}>
              Aucun membre dans la famille
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={editingProfile}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditingProfile(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ color: '#333', fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>
              Modifier le profil
            </Text>

            <Text style={styles.modalLabel}>Nom de famille</Text>
            <TextInput
              style={styles.modalInput}
              value={profile?.family_name}
              onChangeText={(text) => setProfile(prev => ({ ...prev, family_name: text }))}
              placeholder="Nom de famille"
              placeholderTextColor="#999"
            />

            <Text style={styles.modalLabel}>Budget</Text>
            <TextInput
              style={styles.modalInput}
              value={profile?.budget}
              onChangeText={(text) => setProfile(prev => ({ ...prev, budget: text }))}
              placeholder="Budget"
              placeholderTextColor="#999"
            />

            <Text style={styles.modalLabel}>Type de voyage</Text>
            <TextInput
              style={styles.modalInput}
              value={profile?.travel_type?.join(', ')}
              onChangeText={(text) => setProfile(prev => ({ ...prev, travel_type: text.split(',').map(t => t.trim()) }))}
              placeholder="Types de voyage (séparés par des virgules)"
              placeholderTextColor="#999"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditingProfile(false)}
              >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => handleProfileUpdate({
                  family_name: profile.family_name,
                  budget: profile.budget,
                  travel_type: profile.travel_type,
                })}
              >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showEditMemberModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditMemberModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ color: '#333', fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>
              Modifier le membre
            </Text>
            
            <Text style={styles.modalLabel}>Prénom</Text>
            <TextInput
              style={styles.modalInput}
              value={editingMember?.first_name}
              onChangeText={(text) => setEditingMember(prev => ({ ...prev, first_name: text }))}
              placeholder="Prénom"
              placeholderTextColor="#999"
            />

            <Text style={styles.modalLabel}>Nom</Text>
            <TextInput
              style={styles.modalInput}
              value={editingMember?.last_name}
              onChangeText={(text) => setEditingMember(prev => ({ ...prev, last_name: text }))}
              placeholder="Nom"
              placeholderTextColor="#999"
            />

            <Text style={styles.modalLabel}>Date de naissance</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: '#333', fontSize: 16 }}>
                {editingMember?.birth_date 
                  ? new Date(editingMember.birth_date).toLocaleDateString()
                  : "Sélectionner une date"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={editingMember?.birth_date ? new Date(editingMember.birth_date) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowEditMemberModal(false);
                  setEditingMember(null);
                  setShowDatePicker(false);
                }}
              >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                  Annuler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => {
                  handleMemberUpdate(editingMember.id, editingMember);
                  setShowDatePicker(false);
                }}
              >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                  Enregistrer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5ED',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F7F5ED',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yellowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.secondary,
    marginLeft: 12,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  infoContainer: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  editProfileButton: {
    margin: 16,
    padding: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  editProfileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  membersContainer: {
    padding: 16,
  },
  memberCard: {
    marginBottom: 12,
    backgroundColor: '#F7F5ED',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editMemberButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalLabel: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalInput: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  datePickerButton: {
    width: '100%',
    padding: 16,
    backgroundColor: '#F7F5ED',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    marginTop: 16,
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});