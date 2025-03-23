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
}

interface FamilyMembersProps {
  data: FamilyMember[];
  onUpdate: (data: FamilyMember[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const roles = ['Parent', 'Enfant', 'Grand-parent', 'Autre'];

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

    if (isEditing) {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === currentMember.id ? currentMember : member
        )
      );
    } else {
      setMembers((prev) => [
        ...prev,
        { ...currentMember, id: Date.now().toString() },
      ]);
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
    setCurrentMember(member);
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
                onPress={() =>
                  setCurrentMember((prev) => ({ ...prev, role }))
                }
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
}); 