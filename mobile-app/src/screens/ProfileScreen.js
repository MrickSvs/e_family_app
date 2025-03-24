import React, { useState, useEffect } from "react";
import { SafeAreaView, View, ScrollView, TouchableOpacity, StyleSheet, Alert, Image, Text, ActivityIndicator, Dimensions } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProfile } from '../services/profileService';
import { theme } from "../styles/theme";

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const insets = useSafeAreaInsets();
  const [preferences, setPreferences] = useState({
    travelStyle: 'moderate',
    accommodationType: 'comfort',
    activities: ['nature', 'culture'],
    pace: 'balanced',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProfile();
      console.log("Profile data received:", JSON.stringify(response, null, 2));
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

  const handleEditMember = (memberId) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'Main',
        params: {
          screen: 'FamilyProfile',
          params: { memberId }
        },
      })
    );
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
      
      {/* Style de voyage */}
      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceLabel}>Style de voyage</Text>
        <View style={styles.preferenceOptions}>
          {['budget', 'moderate', 'luxury'].map((style) => (
            <TouchableOpacity
              key={style}
              style={[
                styles.preferenceOption,
                preferences.travelStyle === style && styles.preferenceOptionSelected,
              ]}
              onPress={() => setPreferences({ ...preferences, travelStyle: style })}
            >
              <Text style={[
                styles.preferenceOptionText,
                preferences.travelStyle === style && styles.preferenceOptionTextSelected,
              ]}>
                {style === 'budget' ? 'Budget' : style === 'moderate' ? 'Modéré' : 'Luxe'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Type d'hébergement */}
      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceLabel}>Type d'hébergement</Text>
        <View style={styles.preferenceOptions}>
          {['basic', 'comfort', 'luxury'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.preferenceOption,
                preferences.accommodationType === type && styles.preferenceOptionSelected,
              ]}
              onPress={() => setPreferences({ ...preferences, accommodationType: type })}
            >
              <Text style={[
                styles.preferenceOptionText,
                preferences.accommodationType === type && styles.preferenceOptionTextSelected,
              ]}>
                {type === 'basic' ? 'Simple' : type === 'comfort' ? 'Confort' : 'Luxe'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Activités préférées */}
      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceLabel}>Activités préférées</Text>
        <View style={styles.activitiesGrid}>
          {['nature', 'culture', 'adventure', 'relaxation'].map((activity) => (
            <TouchableOpacity
              key={activity}
              style={[
                styles.activityOption,
                preferences.activities.includes(activity) && styles.activityOptionSelected,
              ]}
              onPress={() => {
                const newActivities = preferences.activities.includes(activity)
                  ? preferences.activities.filter(a => a !== activity)
                  : [...preferences.activities, activity];
                setPreferences({ ...preferences, activities: newActivities });
              }}
            >
              <Ionicons
                name={
                  activity === 'nature' ? 'leaf-outline' :
                  activity === 'culture' ? 'museum-outline' :
                  activity === 'adventure' ? 'compass-outline' :
                  'sunny-outline'
                }
                size={24}
                color={preferences.activities.includes(activity) ? '#fff' : theme.colors.primary}
              />
              <Text style={[
                styles.activityOptionText,
                preferences.activities.includes(activity) && styles.activityOptionTextSelected,
              ]}>
                {activity === 'nature' ? 'Nature' :
                 activity === 'culture' ? 'Culture' :
                 activity === 'adventure' ? 'Aventure' :
                 'Détente'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Rythme de voyage */}
      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceLabel}>Rythme de voyage</Text>
        <View style={styles.preferenceOptions}>
          {['relaxed', 'balanced', 'intensive'].map((pace) => (
            <TouchableOpacity
              key={pace}
              style={[
                styles.preferenceOption,
                preferences.pace === pace && styles.preferenceOptionSelected,
              ]}
              onPress={() => setPreferences({ ...preferences, pace })}
            >
              <Text style={[
                styles.preferenceOptionText,
                preferences.pace === pace && styles.preferenceOptionTextSelected,
              ]}>
                {pace === 'relaxed' ? 'Détendu' :
                 pace === 'balanced' ? 'Équilibré' :
                 'Intensif'}
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
            <TouchableOpacity 
              style={styles.addMemberButton}
              onPress={() => handleEditMember()}
            >
              <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
              <Text style={styles.addMemberText}>Ajouter</Text>
            </TouchableOpacity>
          </View>

          {profile?.members?.map((member) => (
            <TouchableOpacity
              key={member.id}
              style={styles.memberCard}
              onPress={() => handleEditMember(member.id)}
            >
              <View style={styles.memberInfo}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberInitials}>
                    {member.first_name?.[0]}{member.last_name?.[0]}
                  </Text>
                </View>
                <View style={styles.memberDetails}>
                  <Text style={styles.memberName}>
                    {member.first_name} {member.last_name}
                  </Text>
                  <View style={styles.memberMeta}>
                    <Text style={styles.memberRole}>{member.role}</Text>
                    {member.birth_date && (
                      <Text style={styles.memberAge}>
                        • {Math.floor((new Date() - new Date(member.birth_date)) / (1000 * 60 * 60 * 24 * 365.25))} ans
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Bouton de sauvegarde */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
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
  memberMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
  memberAge: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
});