import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { MemberPreviewCard } from '../../../components/MemberPreviewCard';
import { PreferenceSelector } from '../../../components/PreferenceSelector';

interface FamilyMember {
  id: string;
  name: string;
  age: string;
  role: string;
  dietaryRestrictions: string[];
  adultPreferences?: {
    travelExperience: string[];
    interests: string[];
    comfortLevel: string;
    pacePreference: string;
    accommodationStyle: string[];
  };
  childPreferences?: {
    interests: string[];
    energyLevel: string;
    attentionSpan: string;
    comfortItems: string[];
    specialNeeds: string[];
  };
}

interface FamilyMembersProps {
  data: FamilyMember[];
  onUpdate: (data: FamilyMember[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const roles = ['Parent', 'Enfant', 'Grand-parent', 'Autre'];

const adultTravelExperiences = [
  'Débutant',
  'Intermédiaire',
  'Expert',
  'Aventureux',
  'Prudent'
];

const adultInterests = [
  'Culture',
  'Nature',
  'Gastronomie',
  'Sport',
  'Shopping',
  'Histoire',
  'Art',
  'Relaxation'
];

const childInterests = [
  'Animaux',
  'Parcs d\'attractions',
  'Plage',
  'Musées interactifs',
  'Sport',
  'Nature',
  'Culture',
  'Jeux'
];

const energyLevels = ['Calme', 'Modéré', 'Très actif'];
const attentionSpans = ['Court', 'Moyen', 'Long'];
const comfortLevels = ['Basique', 'Confortable', 'Luxe'];
const pacePreferences = ['Lent', 'Modéré', 'Rapide'];
const accommodationStyles = ['Hôtel', 'Appartement', 'Maison', 'Camping', 'Auberge'];

export const FamilyMembers: React.FC<FamilyMembersProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious,
}) => {
  const [members, setMembers] = useState<FamilyMember[]>(data);
  const [currentMember, setCurrentMember] = useState<FamilyMember>({
    id: '',
    name: '',
    age: '',
    role: '',
    dietaryRestrictions: [],
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setMembers(data);
  }, [data]);

  const handleAddMember = () => {
    if (!currentMember.name.trim() || !currentMember.age.trim() || !currentMember.role) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const memberToAdd = {
      ...currentMember,
      id: isEditing ? currentMember.id : Date.now().toString(),
    };

    if (memberToAdd.role === 'Parent' || memberToAdd.role === 'Grand-parent') {
      memberToAdd.adultPreferences = {
        travelExperience: [],
        interests: [],
        comfortLevel: '',
        pacePreference: '',
        accommodationStyle: [],
      };
    } else if (memberToAdd.role === 'Enfant') {
      memberToAdd.childPreferences = {
        interests: [],
        energyLevel: '',
        attentionSpan: '',
        comfortItems: [],
        specialNeeds: [],
      };
    }

    if (isEditing) {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === currentMember.id ? memberToAdd : member
        )
      );
    } else {
      setMembers((prev) => [...prev, memberToAdd]);
    }

    setCurrentMember({
      id: '',
      name: '',
      age: '',
      role: '',
      dietaryRestrictions: [],
    });
    setIsEditing(false);
  };

  const handleEditMember = (member: FamilyMember) => {
    const memberWithPreferences = {
      ...member,
      adultPreferences: member.role === 'Parent' || member.role === 'Grand-parent' 
        ? member.adultPreferences || {
            travelExperience: [],
            interests: [],
            comfortLevel: '',
            pacePreference: '',
            accommodationStyle: [],
          }
        : undefined,
      childPreferences: member.role === 'Enfant'
        ? member.childPreferences || {
            interests: [],
            energyLevel: '',
            attentionSpan: '',
            comfortItems: [],
            specialNeeds: [],
          }
        : undefined,
    };
    setCurrentMember(memberWithPreferences);
    setIsEditing(true);
  };

  const handleDeleteMember = (id: string) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer ce membre ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: () => {
            setMembers((prev) => prev.filter((member) => member.id !== id));
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleSubmit = () => {
    if (members.length === 0) {
      Alert.alert('Erreur', 'Veuillez ajouter au moins un membre à la famille');
      return;
    }
    onUpdate(members);
    onNext();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Membres de la famille</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            value={currentMember.name}
            onChangeText={(text) =>
              setCurrentMember((prev) => ({ ...prev, name: text }))
            }
            placeholder="Prénom"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Âge</Text>
          <TextInput
            style={styles.input}
            value={currentMember.age}
            onChangeText={(text) =>
              setCurrentMember((prev) => ({ ...prev, age: text }))
            }
            placeholder="Âge"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Rôle</Text>
          <View style={styles.roleContainer}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleChip,
                  currentMember.role === role && styles.roleChipSelected,
                ]}
                onPress={() => {
                  if (role === 'Parent' || role === 'Grand-parent') {
                    setCurrentMember((prev) => ({
                      ...prev,
                      role,
                      adultPreferences: {
                        travelExperience: [],
                        interests: [],
                        comfortLevel: '',
                        pacePreference: '',
                        accommodationStyle: [],
                      },
                      childPreferences: undefined,
                    }));
                  } else if (role === 'Enfant') {
                    setCurrentMember((prev) => ({
                      ...prev,
                      role,
                      childPreferences: {
                        interests: [],
                        energyLevel: '',
                        attentionSpan: '',
                        comfortItems: [],
                        specialNeeds: [],
                      },
                      adultPreferences: undefined,
                    }));
                  } else {
                    setCurrentMember((prev) => ({
                      ...prev,
                      role,
                      adultPreferences: undefined,
                      childPreferences: undefined,
                    }));
                  }
                }}
              >
                <Text
                  style={[
                    styles.roleChipText,
                    currentMember.role === role && styles.roleChipTextSelected,
                  ]}
                >
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {(currentMember.role === 'Parent' || currentMember.role === 'Grand-parent') && (
          <View style={styles.preferencesContainer}>
            <Text style={styles.sectionTitle}>Préférences de voyage</Text>
            
            <PreferenceSelector
              title="Expérience de voyage"
              options={adultTravelExperiences}
              selected={currentMember.adultPreferences?.travelExperience || []}
              onChange={(value) => {
                const newExperiences = currentMember.adultPreferences?.travelExperience.includes(value)
                  ? currentMember.adultPreferences.travelExperience.filter(e => e !== value)
                  : [...(currentMember.adultPreferences?.travelExperience || []), value];
                setCurrentMember(prev => ({
                  ...prev,
                  adultPreferences: {
                    ...prev.adultPreferences,
                    travelExperience: newExperiences,
                  },
                }));
              }}
            />

            <PreferenceSelector
              title="Centres d'intérêt"
              options={adultInterests}
              selected={currentMember.adultPreferences?.interests || []}
              onChange={(value) => {
                const newInterests = currentMember.adultPreferences?.interests.includes(value)
                  ? currentMember.adultPreferences.interests.filter(i => i !== value)
                  : [...(currentMember.adultPreferences?.interests || []), value];
                setCurrentMember(prev => ({
                  ...prev,
                  adultPreferences: {
                    ...prev.adultPreferences,
                    interests: newInterests,
                  },
                }));
              }}
            />
          </View>
        )}

        {currentMember.role === 'Enfant' && (
          <View style={styles.preferencesContainer}>
            <Text style={styles.sectionTitle}>Préférences de l'enfant</Text>
            
            <PreferenceSelector
              title="Centres d'intérêt"
              options={childInterests}
              selected={currentMember.childPreferences?.interests || []}
              onChange={(value) => {
                const newInterests = currentMember.childPreferences?.interests.includes(value)
                  ? currentMember.childPreferences.interests.filter(i => i !== value)
                  : [...(currentMember.childPreferences?.interests || []), value];
                setCurrentMember(prev => ({
                  ...prev,
                  childPreferences: {
                    ...prev.childPreferences,
                    interests: newInterests,
                  },
                }));
              }}
            />

            <PreferenceSelector
              title="Niveau d'énergie"
              options={energyLevels}
              selected={currentMember.childPreferences?.energyLevel ? [currentMember.childPreferences.energyLevel] : []}
              onChange={(value) => {
                setCurrentMember(prev => ({
                  ...prev,
                  childPreferences: {
                    ...prev.childPreferences,
                    energyLevel: value,
                  },
                }));
              }}
            />

            <PreferenceSelector
              title="Capacité d'attention"
              options={attentionSpans}
              selected={currentMember.childPreferences?.attentionSpan ? [currentMember.childPreferences.attentionSpan] : []}
              onChange={(value) => {
                setCurrentMember(prev => ({
                  ...prev,
                  childPreferences: {
                    ...prev.childPreferences,
                    attentionSpan: value,
                  },
                }));
              }}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddMember}
        >
          <Text style={styles.addButtonText}>
            {isEditing ? 'Modifier' : 'Ajouter'} le membre
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.membersList}>
        {members.map((member) => (
          <MemberPreviewCard
            key={member.id}
            member={member}
            onEdit={handleEditMember}
            onDelete={handleDeleteMember}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={onPrevious}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            Précédent
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Suivant</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  roleChipSelected: {
    backgroundColor: '#007AFF',
  },
  roleChipText: {
    color: '#666',
    fontSize: 14,
  },
  roleChipTextSelected: {
    color: '#fff',
  },
  preferencesContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  membersList: {
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 16,
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#007AFF',
  },
}); 