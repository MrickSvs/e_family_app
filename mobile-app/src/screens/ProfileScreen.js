import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, Image, ActivityIndicator, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProfile, updateFamilyProfile, updateMemberProfile, addFamilyMember, deleteFamilyMember } from '../services/profileService';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Chip } from '../components/Chip';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [editingMember, setEditingMember] = useState(null);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const insets = useSafeAreaInsets();

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
      const updatedMember = await updateMemberProfile(memberId, data);
      setProfile(prev => ({
        ...prev,
        members: prev.members.map(m => m.id === memberId ? updatedMember : m)
      }));
      setShowEditMemberModal(false);
      setEditingMember(null);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le membre');
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
      {/* En-tête similaire à FamilyTripsScreen */}
      <View style={styles.topContainer}>
        <Text style={styles.mainTitle}>Mon Profil</Text>
        <Text style={styles.subtitle}>Gérer mes informations familiales</Text>
      </View>

      {/* Contenu principal */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileSection}>
          <Text style={styles.profileTitle}>Profil famille</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate("FamilyProfile")}
          >
            <Text style={styles.ctaButtonText}>Compléter mon profil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Section des membres avec champs supplémentaires */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Membres de la famille
            <Text style={styles.memberCount}>
              {" "}({profile?.members?.length || 0})
            </Text>
          </Text>
          {editMode && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddMemberModal(true)}
            >
              <MaterialIcons name="person-add" size={24} color="#0066FF" />
            </TouchableOpacity>
          )}
        </View>

        {profile?.members.map((member) => (
          <Animated.View 
            key={member.id} 
            style={[
              styles.memberCard,
              {
                transform: [{
                  scale: selectedMember?.id === member.id ? 1.02 : 1
                }]
              }
            ]}
          >
            <TouchableOpacity
              style={styles.memberHeader}
              onPress={() => toggleMemberDetails(member.id)}
            >
              <View style={styles.memberInfo}>
                <View style={styles.memberNameContainer}>
                  {editMode ? (
                    <TouchableOpacity
                      onPress={() => handleMemberEdit(member)}
                      style={styles.memberEditButton}
                    >
                      <Text style={styles.memberName}>
                        {member.first_name} {member.last_name}
                      </Text>
                      <MaterialIcons name="edit" size={16} color="#0066FF" />
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.memberName}>
                      {member.first_name} {member.last_name}
                    </Text>
                  )}
                </View>
                <Text style={styles.memberRole}>{member.role}</Text>
                {member.birth_date && (
                  <Text style={styles.memberBirthDate}>
                    {new Date(member.birth_date).toLocaleDateString()}
                  </Text>
                )}
              </View>
              <View style={styles.memberActions}>
                {editMode && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteMember(member.id)}
                  >
                    <MaterialIcons name="delete" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                )}
                <MaterialIcons
                  name={selectedMember?.id === member.id ? 'expand-less' : 'expand-more'}
                  size={24}
                  color="#666"
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

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

            <Text style={styles.inputLabel}>Rôle</Text>
            <TextInput
              style={styles.modalInput}
              value={editingMember?.role}
              onChangeText={(text) => setEditingMember(prev => ({ ...prev, role: text }))}
              placeholder="Ex: Parent, Enfant..."
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
  /* Partie haute similaire à FamilyTripsScreen */
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

  /* Contenu déroulant */
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  /* Section Profil */
  profileSection: {
    marginTop: 20,
    alignItems: "center",
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  ctaButton: {
    backgroundColor: "#0f8066",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  /* Section des membres */
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
  addButton: {
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 8,
  },

  /* Modal d'édition de membre */
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
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#0066FF',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerButton: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
});