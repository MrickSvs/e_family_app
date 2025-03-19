import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, Image, ActivityIndicator, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProfile, updateFamilyProfile, updateMemberProfile, addFamilyMember, deleteFamilyMember } from '../services/profileService';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
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
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0f8066" />
          <Text style={styles.loadingText}>Chargement du profil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
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
      // Ensure last_name is included in the update
      const updateData = {
        ...data,
        last_name: data.last_name || '', // Provide a default empty string if last_name is not provided
        role: editingMember.role // Include the existing role in the update
      };

      // Filter the fields to only include allowed ones
      const allowedFields = ['first_name', 'last_name', 'birth_date', 'role'];
      const filteredData = Object.keys(updateData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {});

      const updatedMember = await updateMemberProfile(memberId, filteredData);
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
        birth_date: selectedDate.toISOString().split('T')[0]
      }));
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.topContainer}>
        <Text style={styles.mainTitle}>Mon Profil</Text>
        <Text style={styles.subtitle}>
          Famille {profile?.family_name} • {profile?.members?.filter(m => m.role === 'Adulte').length} adulte{profile?.members?.filter(m => m.role === 'Adulte').length > 1 ? "s" : ""}, {profile?.members?.filter(m => m.role === 'Enfant').length} enfant{profile?.members?.filter(m => m.role === 'Enfant').length > 1 ? "s" : ""}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileSection}>
          <Text style={styles.profileTitle}>
            {profile?.family_name || 'Profil famille'}
          </Text>
        </View>

        {profile?.members && profile.members.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Membres de la famille
                <Text style={styles.memberCount}>
                  {" "}({profile.members.length})
                </Text>
              </Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditMode(!editMode)}
              >
                <MaterialIcons 
                  name={editMode ? "done" : "edit"} 
                  size={24} 
                  color="#0f8066" 
                />
              </TouchableOpacity>
            </View>

            {profile.members.map((member) => (
              <View key={member.id} style={styles.memberCard}>
                <View style={styles.memberHeader}>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {member.first_name} {member.last_name}
                    </Text>
                    <View style={styles.memberDetails}>
                      <Text style={styles.memberRole}>{member.role}</Text>
                      {member.birth_date && (
                        <Text style={styles.memberBirthDate}>
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
                        <MaterialIcons name="edit" size={20} color="#0f8066" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal d'édition de membre */}
      <Modal
        visible={showEditMemberModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditMemberModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier le membre</Text>
            
            <Text style={styles.inputLabel}>Prénom</Text>
            <TextInput
              style={styles.modalInput}
              value={editingMember?.first_name}
              onChangeText={(text) => setEditingMember(prev => ({ ...prev, first_name: text }))}
              placeholder="Prénom"
            />

            <Text style={styles.inputLabel}>Nom</Text>
            <TextInput
              style={styles.modalInput}
              value={editingMember?.last_name}
              onChangeText={(text) => setEditingMember(prev => ({ ...prev, last_name: text }))}
              placeholder="Nom"
            />

            <Text style={styles.inputLabel}>Date de naissance</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerButtonText}>
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
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => {
                  handleMemberUpdate(editingMember.id, editingMember);
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topContainer: {
    backgroundColor: "#F7F5ED",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  profileSection: {
    marginTop: 20,
    alignItems: "center",
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  memberCount: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    padding: 8,
  },
  memberCard: {
    marginBottom: 16,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  memberDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
  memberBirthDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editMemberButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  modalInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#0f8066',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerButton: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0f8066',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});