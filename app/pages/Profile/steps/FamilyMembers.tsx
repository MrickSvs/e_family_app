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
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Expérience de voyage</Text>
              <View style={styles.chipContainer}>
                {adultTravelExperiences.map((exp) => (
                  <TouchableOpacity
                    key={exp}
                    style={[
                      styles.chip,
                      currentMember.adultPreferences?.travelExperience.includes(exp) && styles.chipSelected,
                    ]}
                    onPress={() => {
                      const newExperiences = currentMember.adultPreferences?.travelExperience.includes(exp)
                        ? currentMember.adultPreferences.travelExperience.filter(e => e !== exp)
                        : [...(currentMember.adultPreferences?.travelExperience || []), exp];
                      setCurrentMember(prev => ({
                        ...prev,
                        adultPreferences: {
                          ...prev.adultPreferences,
                          travelExperience: newExperiences,
                        },
                      }));
                    }}
                  >
                    <Text style={[
                      styles.chipText,
                      currentMember.adultPreferences?.travelExperience.includes(exp) && styles.chipTextSelected,
                    ]}>
                      {exp}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Centres d'intérêt</Text>
              <View style={styles.chipContainer}>
                {adultInterests.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    style={[
                      styles.chip,
                      currentMember.adultPreferences?.interests.includes(interest) && styles.chipSelected,
                    ]}
                    onPress={() => {
                      const newInterests = currentMember.adultPreferences?.interests.includes(interest)
                        ? currentMember.adultPreferences.interests.filter(i => i !== interest)
                        : [...(currentMember.adultPreferences?.interests || []), interest];
                      setCurrentMember(prev => ({
                        ...prev,
                        adultPreferences: {
                          ...prev.adultPreferences,
                          interests: newInterests,
                        },
                      }));
                    }}
                  >
                    <Text style={[
                      styles.chipText,
                      currentMember.adultPreferences?.interests.includes(interest) && styles.chipTextSelected,
                    ]}>
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Niveau de confort</Text>
              <View style={styles.chipContainer}>
                {comfortLevels.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.chip,
                      currentMember.adultPreferences?.comfortLevel === level && styles.chipSelected,
                    ]}
                    onPress={() => {
                      setCurrentMember(prev => ({
                        ...prev,
                        adultPreferences: {
                          ...prev.adultPreferences,
                          comfortLevel: level,
                        },
                      }));
                    }}
                  >
                    <Text style={[
                      styles.chipText,
                      currentMember.adultPreferences?.comfortLevel === level && styles.chipTextSelected,
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {currentMember.role === 'Enfant' && (
          <View style={styles.preferencesContainer}>
            <Text style={styles.sectionTitle}>Préférences de l'enfant</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Centres d'intérêt</Text>
              <View style={styles.chipContainer}>
                {childInterests.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    style={[
                      styles.chip,
                      currentMember.childPreferences?.interests.includes(interest) && styles.chipSelected,
                    ]}
                    onPress={() => {
                      const newInterests = currentMember.childPreferences?.interests.includes(interest)
                        ? currentMember.childPreferences.interests.filter(i => i !== interest)
                        : [...(currentMember.childPreferences?.interests || []), interest];
                      setCurrentMember(prev => ({
                        ...prev,
                        childPreferences: {
                          ...prev.childPreferences,
                          interests: newInterests,
                        },
                      }));
                    }}
                  >
                    <Text style={[
                      styles.chipText,
                      currentMember.childPreferences?.interests.includes(interest) && styles.chipTextSelected,
                    ]}>
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Niveau d'énergie</Text>
              <View style={styles.chipContainer}>
                {energyLevels.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.chip,
                      currentMember.childPreferences?.energyLevel === level && styles.chipSelected,
                    ]}
                    onPress={() => {
                      setCurrentMember(prev => ({
                        ...prev,
                        childPreferences: {
                          ...prev.childPreferences,
                          energyLevel: level,
                        },
                      }));
                    }}
                  >
                    <Text style={[
                      styles.chipText,
                      currentMember.childPreferences?.energyLevel === level && styles.chipTextSelected,
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Capacité d'attention</Text>
              <View style={styles.chipContainer}>
                {attentionSpans.map((span) => (
                  <TouchableOpacity
                    key={span}
                    style={[
                      styles.chip,
                      currentMember.childPreferences?.attentionSpan === span && styles.chipSelected,
                    ]}
                    onPress={() => {
                      setCurrentMember(prev => ({
                        ...prev,
                        childPreferences: {
                          ...prev.childPreferences,
                          attentionSpan: span,
                        },
                      }));
                    }}
                  >
                    <Text style={[
                      styles.chipText,
                      currentMember.childPreferences?.attentionSpan === span && styles.chipTextSelected,
                    ]}>
                      {span}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
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
          <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberDetails}>
                {member.age} ans • {member.role}
              </Text>
              
              {(member.role === 'Parent' || member.role === 'Grand-parent') && member.adultPreferences && (
                <View style={styles.preferencesList}>
                  {member.adultPreferences.travelExperience.length > 0 && (
                    <View style={styles.preferenceItem}>
                      <Text style={styles.preferenceLabel}>Expérience :</Text>
                      <View style={styles.preferenceChips}>
                        {member.adultPreferences.travelExperience.map((exp, index) => (
                          <View key={index} style={styles.preferenceChip}>
                            <Text style={styles.preferenceChipText}>{exp}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                  
                  {member.adultPreferences.interests.length > 0 && (
                    <View style={styles.preferenceItem}>
                      <Text style={styles.preferenceLabel}>Centres d'intérêt :</Text>
                      <View style={styles.preferenceChips}>
                        {member.adultPreferences.interests.map((interest, index) => (
                          <View key={index} style={styles.preferenceChip}>
                            <Text style={styles.preferenceChipText}>{interest}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                  
                  {member.adultPreferences.comfortLevel && (
                    <View style={styles.preferenceItem}>
                      <Text style={styles.preferenceLabel}>Confort :</Text>
                      <View style={styles.preferenceChip}>
                        <Text style={styles.preferenceChipText}>{member.adultPreferences.comfortLevel}</Text>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {member.role === 'Enfant' && member.childPreferences && (
                <View style={styles.preferencesList}>
                  {member.childPreferences.interests.length > 0 && (
                    <View style={styles.preferenceItem}>
                      <Text style={styles.preferenceLabel}>Centres d'intérêt :</Text>
                      <View style={styles.preferenceChips}>
                        {member.childPreferences.interests.map((interest, index) => (
                          <View key={index} style={styles.preferenceChip}>
                            <Text style={styles.preferenceChipText}>{interest}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                  
                  {member.childPreferences.energyLevel && (
                    <View style={styles.preferenceItem}>
                      <Text style={styles.preferenceLabel}>Énergie :</Text>
                      <View style={styles.preferenceChip}>
                        <Text style={styles.preferenceChipText}>{member.childPreferences.energyLevel}</Text>
                      </View>
                    </View>
                  )}
                  
                  {member.childPreferences.attentionSpan && (
                    <View style={styles.preferenceItem}>
                      <Text style={styles.preferenceLabel}>Attention :</Text>
                      <View style={styles.preferenceChip}>
                        <Text style={styles.preferenceChipText}>{member.childPreferences.attentionSpan}</Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
            <View style={styles.memberActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditMember(member)}
              >
                <Text style={styles.actionButtonText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteMember(member.id)}
              >
                <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                  Supprimer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  roleChip: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  roleChipSelected: {
    backgroundColor: '#0f8066',
    borderColor: '#0f8066',
  },
  roleChipText: {
    color: '#666',
    fontSize: 14,
  },
  roleChipTextSelected: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#0f8066',
    padding: 12,
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
    marginBottom: 24,
  },
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  memberDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#0f8066',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  deleteButtonText: {
    color: '#ff5252',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    backgroundColor: '#0f8066',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0f8066',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    color: '#0f8066',
  },
  preferencesContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chip: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chipSelected: {
    backgroundColor: '#0f8066',
    borderColor: '#0f8066',
  },
  chipText: {
    color: '#666',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
  },
  preferencesList: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  preferenceItem: {
    marginBottom: 8,
  },
  preferenceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  preferenceChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  preferenceChip: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    margin: 2,
  },
  preferenceChipText: {
    color: '#0f8066',
    fontSize: 12,
  },
}); 