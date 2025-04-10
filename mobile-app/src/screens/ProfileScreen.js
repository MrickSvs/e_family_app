import React, { useState, useEffect } from "react";
import { SafeAreaView, View, ScrollView, TouchableOpacity, StyleSheet, Alert, Image, Text, ActivityIndicator, Dimensions, Modal, Share } from "react-native";
import { useNavigation, CommonActions, useTheme } from "@react-navigation/native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProfile, updateProfile, updateMemberProfile } from '../services/profileService';
import { theme } from "../styles/theme";
import { FamilyMemberEditor } from '../components/FamilyMemberEditor';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const insets = useSafeAreaInsets();
  const [preferences, setPreferences] = useState({
    travelStyle: 'moderate',
    accommodationType: 'comfort',
    activities: [],
    pace: 'balanced',
  });
  const [editingMember, setEditingMember] = useState(null);
  const [showMemberEditor, setShowMemberEditor] = useState(false);
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProfile();
      if (!response) {
        throw new Error('No profile data received');
      }
      setProfile(response);
      
      // Mettre à jour les préférences avec les données du profil
      if (response.travel_preferences) {
        setPreferences(prev => ({
          ...prev,
          activities: response.travel_preferences.travel_type || [],
          travelStyle: response.travel_preferences.budget || 'moderate',
          accommodationType: response.travel_preferences.accommodation_type || 'comfort',
          pace: response.travel_preferences.travel_pace || 'balanced',
        }));
      }
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

  const handleSavePreferences = async () => {
    try {
      setUpdating(true);
      const updatedProfile = {
        ...profile,
        travel_preferences: {
          travel_type: preferences.activities,
          budget: preferences.travelStyle,
          accommodation_type: preferences.accommodationType,
          travel_pace: preferences.pace,
        }
      };
      
      await updateProfile(updatedProfile);
      setProfile(prev => ({
        ...prev,
        travel_preferences: updatedProfile.travel_preferences
      }));
      Alert.alert(
        'Succès',
        'Vos préférences ont été mises à jour avec succès.'
      );
    } catch (err) {
      console.error("Error saving preferences:", err);
      Alert.alert(
        'Erreur',
        'Impossible de sauvegarder vos préférences. Veuillez réessayer.'
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleEditProfile = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Main',
        params: {
          screen: 'FamilyProfile'
        },
      })
    );
  };

  const handleEditMember = (member = null) => {
    setSelectedMember(member);
    setIsEditorVisible(true);
  };

  const handleSaveMember = async (memberData) => {
    try {
      if (selectedMember) {
        await updateMemberProfile(selectedMember.id, memberData);
      } else {
        // TODO: Implement add new member
      }
      await loadProfile();
      setIsEditorVisible(false);
      setSelectedMember(null);
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Impossible de sauvegarder les modifications. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCancelEdit = () => {
    setShowMemberEditor(false);
    setEditingMember(null);
  };

  const handleShare = async (member = null) => {
    try {
      const message = member 
        ? `Rejoins la famille ${profile.family_name} sur Family App ! ${member.first_name} t'invite à partager vos moments en famille.`
        : `Rejoins la famille ${profile.family_name} sur Family App ! Partageons nos moments en famille ensemble.`;
        
      const result = await Share.share({
        message: message,
        title: 'Invitation Family App'
      });
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Erreur',
        'Impossible de partager l\'invitation. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    }
  };

  // Calculer le nombre d'adultes et d'enfants
  const countMembersByRole = (members) => {
    if (!members) return { adults: 0, children: 0 };
    return members.reduce((acc, member) => {
      if (member.role === 'Adulte') acc.adults++;
      if (member.role === 'Enfant') acc.children++;
      return acc;
    }, { adults: 0, children: 0 });
  };

  // Extraire les âges des enfants
  const getChildrenAges = (members) => {
    if (!members) return [];
    return members
      .filter(member => member.role === 'Enfant' && member.birth_date)
      .map(member => {
        const birthDate = new Date(member.birth_date);
        const age = Math.floor((new Date() - birthDate) / (1000 * 60 * 60 * 24 * 365.25));
        return age;
      });
  };

  const renderPreferenceSection = () => (
    <View style={styles.preferenceSection}>
      <Text style={styles.sectionTitle}>Préférences de voyage</Text>
      
      {/* Budget */}
      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceLabel}>Budget</Text>
        <View style={styles.preferenceOptions}>
          {['Économique', 'Modéré', 'Luxe'].map((budget) => (
            <TouchableOpacity
              key={budget}
              style={[
                styles.preferenceOption,
                profile?.travel_preferences?.budget === budget && styles.preferenceOptionSelected,
              ]}
              onPress={async () => {
                try {
                  setUpdating(true);
                  const updatedProfile = {
                    family_name: profile.family_name,
                    travel_preferences: {
                      travel_type: profile?.travel_preferences?.travel_type || [],
                      budget,
                      accommodation_type: profile?.travel_preferences?.accommodation_type || 'Hôtel',
                      travel_pace: profile?.travel_preferences?.travel_pace || 'Relaxé'
                    }
                  };
                  await updateProfile(updatedProfile);
                  setProfile(prev => ({
                    ...prev,
                    travel_preferences: updatedProfile.travel_preferences
                  }));
                } catch (err) {
                  console.error("Error updating budget:", err);
                  Alert.alert('Erreur', 'Impossible de mettre à jour le budget');
                } finally {
                  setUpdating(false);
                }
              }}
            >
              <Text style={[
                styles.preferenceOptionText,
                profile?.travel_preferences?.budget === budget && styles.preferenceOptionTextSelected,
              ]}>
                {budget}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Type d'hébergement */}
      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceLabel}>Type d'hébergement</Text>
        <View style={styles.preferenceOptions}>
          {['Hôtel', 'Appartement', 'Surprise'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.preferenceOption,
                profile?.travel_preferences?.accommodation_type === type && styles.preferenceOptionSelected,
              ]}
              onPress={async () => {
                try {
                  setUpdating(true);
                  const updatedProfile = {
                    family_name: profile.family_name,
                    travel_preferences: {
                      travel_type: profile?.travel_preferences?.travel_type || [],
                      budget: profile?.travel_preferences?.budget || 'Économique',
                      accommodation_type: type,
                      travel_pace: profile?.travel_preferences?.travel_pace || 'Relaxé'
                    }
                  };
                  await updateProfile(updatedProfile);
                  setProfile(prev => ({
                    ...prev,
                    travel_preferences: updatedProfile.travel_preferences
                  }));
                } catch (err) {
                  console.error("Error updating accommodation type:", err);
                  Alert.alert('Erreur', 'Impossible de mettre à jour le type d\'hébergement');
                } finally {
                  setUpdating(false);
                }
              }}
            >
              <Text style={[
                styles.preferenceOptionText,
                profile?.travel_preferences?.accommodation_type === type && styles.preferenceOptionTextSelected,
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Activités préférées */}
      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceLabel}>Activités préférées</Text>
        <View style={styles.activitiesGrid}>
          {['Culture', 'Nature', 'Plage', 'Sport', 'Découverte', 'Détente', 'Aventure', 'Non spécifié'].map((activity) => (
            <TouchableOpacity
              key={activity}
              style={[
                styles.activityOption,
                profile?.travel_preferences?.travel_type?.includes(activity) && styles.activityOptionSelected,
              ]}
              onPress={async () => {
                try {
                  setUpdating(true);
                  const currentActivities = profile?.travel_preferences?.travel_type || [];
                  const newActivities = currentActivities.includes(activity)
                    ? currentActivities.filter(a => a !== activity)
                    : [...currentActivities, activity];
                  
                  const updatedProfile = {
                    family_name: profile.family_name,
                    travel_preferences: {
                      travel_type: newActivities,
                      budget: profile?.travel_preferences?.budget || 'Économique',
                      accommodation_type: profile?.travel_preferences?.accommodation_type || 'Hôtel',
                      travel_pace: profile?.travel_preferences?.travel_pace || 'Relaxé'
                    }
                  };
                  await updateProfile(updatedProfile);
                  setProfile(prev => ({
                    ...prev,
                    travel_preferences: updatedProfile.travel_preferences
                  }));
                } catch (err) {
                  console.error("Error updating activities:", err);
                  Alert.alert('Erreur', 'Impossible de mettre à jour les activités');
                } finally {
                  setUpdating(false);
                }
              }}
            >
              <Ionicons
                name={
                  activity === 'Nature' ? 'leaf-outline' :
                  activity === 'Culture' ? 'library-outline' :
                  activity === 'Plage' ? 'sunny-outline' :
                  activity === 'Sport' ? 'bicycle-outline' :
                  activity === 'Découverte' ? 'compass-outline' :
                  activity === 'Détente' ? 'bed-outline' :
                  activity === 'Aventure' ? 'map-outline' :
                  'help-circle-outline'
                }
                size={24}
                color={profile?.travel_preferences?.travel_type?.includes(activity) ? '#fff' : theme.colors.primary}
              />
              <Text style={[
                styles.activityOptionText,
                profile?.travel_preferences?.travel_type?.includes(activity) && styles.activityOptionTextSelected,
              ]}>
                {activity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Rythme de voyage */}
      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceLabel}>Rythme de voyage</Text>
        <View style={styles.preferenceOptions}>
          {['Relaxé', 'Equilibré', 'Actif'].map((pace) => (
            <TouchableOpacity
              key={pace}
              style={[
                styles.preferenceOption,
                profile?.travel_preferences?.travel_pace === pace && styles.preferenceOptionSelected,
              ]}
              onPress={async () => {
                try {
                  setUpdating(true);
                  const updatedProfile = {
                    family_name: profile.family_name,
                    travel_preferences: {
                      travel_type: profile?.travel_preferences?.travel_type || [],
                      budget: profile?.travel_preferences?.budget || 'Économique',
                      accommodation_type: profile?.travel_preferences?.accommodation_type || 'Hôtel',
                      travel_pace: pace
                    }
                  };
                  await updateProfile(updatedProfile);
                  setProfile(prev => ({
                    ...prev,
                    travel_preferences: updatedProfile.travel_preferences
                  }));
                } catch (err) {
                  console.error("Error updating travel pace:", err);
                  Alert.alert('Erreur', 'Impossible de mettre à jour le rythme de voyage');
                } finally {
                  setUpdating(false);
                }
              }}
            >
              <Text style={[
                styles.preferenceOptionText,
                profile?.travel_preferences?.travel_pace === pace && styles.preferenceOptionTextSelected,
              ]}>
                {pace}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

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
        <Text style={styles.errorText}>Une erreur est survenue: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadProfile}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const { adults, children } = countMembersByRole(profile?.members);
  const childrenAges = getChildrenAges(profile?.members);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {updating && (
          <View style={styles.updatingIndicator}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        )}
        {/* En-tête avec photo de profil */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Ionicons name="camera" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{profile?.family_name || 'Ma Famille'}</Text>
          <Text style={styles.subtitle}>{adults} adulte{adults > 1 ? 's' : ''} • {children} enfant{children > 1 ? 's' : ''}</Text>
        </View>

        {/* Section des préférences */}
        {renderPreferenceSection()}

        {/* Section Membres de la famille */}
        <View style={styles.familySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Membres de la famille</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.inviteButton}
                onPress={() => handleShare()}
              >
                <Ionicons name="share-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.inviteButtonText}>Inviter la famille</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.addMemberButton}
                onPress={() => handleEditMember()}
              >
                <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
                <Text style={styles.addMemberText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>

          {profile?.members?.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              <TouchableOpacity
                style={styles.memberInfo}
                onPress={() => handleEditMember(member)}
              >
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberInitials}>
                    {member.first_name?.[0]}{member.last_name?.[0]}
                  </Text>
                </View>
                <View style={styles.memberDetails}>
                  <Text style={styles.memberName}>
                    {member.first_name} {member.last_name}
                  </Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.memberActions}>
                <TouchableOpacity 
                  style={styles.memberInviteButton}
                  onPress={() => handleShare(member)}
                >
                  <Ionicons name="share-social-outline" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
                <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      {isEditorVisible && (
        <FamilyMemberEditor
          visible={isEditorVisible}
          member={selectedMember}
          onSave={handleSaveMember}
          onClose={() => {
            setIsEditorVisible(false);
            setSelectedMember(null);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5ED',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F5ED',
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#F7F5ED',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    opacity: 0.8,
  },
  preferenceSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  preferenceItem: {
    marginBottom: 24,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  preferenceOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  preferenceOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: 'center',
  },
  preferenceOptionSelected: {
    backgroundColor: theme.colors.primary,
  },
  preferenceOptionText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  preferenceOptionTextSelected: {
    color: '#fff',
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  activityOption: {
    width: (width - 56) / 2,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    gap: 8,
  },
  activityOptionSelected: {
    backgroundColor: theme.colors.primary,
  },
  activityOptionText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  activityOptionTextSelected: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  familySection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F0F9F6',
  },
  inviteButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addMemberText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInitials: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberInviteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F0F9F6',
  },
  updatingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.primary,
    zIndex: 1000,
  },
});