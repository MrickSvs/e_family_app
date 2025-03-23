import React, { useState, useEffect } from "react";
import { SafeAreaView, View, ScrollView, TouchableOpacity, StyleSheet, Alert, Image, Text, ActivityIndicator } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProfile } from '../services/profileService';
import { theme } from "../styles/theme";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const insets = useSafeAreaInsets();

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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Mon Profil</Text>
          <View style={styles.yellowDot} />
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditProfile}
        >
          <MaterialIcons name="edit" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Famille */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ma Famille</Text>
            <Text style={styles.sectionSubtitle}>
              {profile?.members?.length || 0} membre{profile?.members?.length > 1 ? 's' : ''}
            </Text>
          </View>

          <View style={styles.familyCard}>
            <View style={styles.familyInfo}>
              <Text style={styles.familyName}>{profile?.family_name || 'Ma Famille'}</Text>
              <Text style={styles.familyComposition}>
                {adults} adulte{adults > 1 ? 's' : ''}, {children} enfant{children > 1 ? 's' : ''}
              </Text>
              <Text style={styles.familyAges}>
                Âges des enfants : {childrenAges.length > 0 ? childrenAges.join(', ') : 'Non renseigné'}
              </Text>
            </View>
          </View>
        </View>

        {/* Section Préférences */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Préférences de Voyage</Text>
          </View>

          <View style={styles.preferencesContainer}>
            <View style={styles.preferenceItem}>
              <Ionicons name="wallet-outline" size={24} color={theme.colors.primary} />
              <View style={styles.preferenceContent}>
                <Text style={styles.preferenceLabel}>Budget</Text>
                <Text style={styles.preferenceValue}>
                  {profile?.travel_preferences?.budget || 'Non renseigné'}
                </Text>
              </View>
            </View>

            <View style={styles.preferenceItem}>
              <Ionicons name="airplane-outline" size={24} color={theme.colors.primary} />
              <View style={styles.preferenceContent}>
                <Text style={styles.preferenceLabel}>Type de voyage</Text>
                <Text style={styles.preferenceValue}>
                  {profile?.travel_preferences?.travel_type?.join(', ') || 'Non renseigné'}
                </Text>
              </View>
            </View>

            <View style={styles.preferenceItem}>
              <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
              <View style={styles.preferenceContent}>
                <Text style={styles.preferenceLabel}>Durée préférée</Text>
                <Text style={styles.preferenceValue}>
                  {profile?.travel_preferences?.preferred_duration || 'Non renseigné'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section Membres */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Membres de la Famille</Text>
          </View>

          {profile?.members?.map((member, index) => (
            <TouchableOpacity
              key={member.id}
              style={styles.memberCard}
              onPress={() => handleEditMember(member.id)}
            >
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>
                  {member.first_name} {member.last_name}
                </Text>
                <View style={styles.memberDetails}>
                  <Text style={styles.memberRole}>{member.role}</Text>
                  {member.birth_date && (
                    <Text style={styles.memberAge}>
                      • {new Date(member.birth_date).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5ED',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  yellowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.secondary,
    marginLeft: 12,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  familyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  familyInfo: {
    gap: 8,
  },
  familyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  familyComposition: {
    fontSize: 16,
    color: '#666',
  },
  familyAges: {
    fontSize: 14,
    color: '#666',
  },
  preferencesContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  preferenceContent: {
    marginLeft: 16,
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#666',
  },
  preferenceValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginTop: 4,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  memberDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
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
});