import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FamilyMember } from '../types';

interface MemberPreviewCardProps {
  member: FamilyMember;
  onEdit: (member: FamilyMember) => void;
  onDelete: (id: string) => void;
}

export const MemberPreviewCard = ({ member, onEdit, onDelete }: MemberPreviewCardProps) => {
  // Fonction utilitaire pour afficher les préférences principales
  const getMainPreferences = () => {
    if (member.role === 'Parent' || member.role === 'Grand-parent') {
      return member.adultPreferences?.interests || [];
    }
    return member.childPreferences?.interests || [];
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{member.name}</Text>
          <Text style={styles.details}>{member.age} ans • {member.role}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.button, styles.editButton]} 
            onPress={() => onEdit(member)}
          >
            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.deleteButton]}
            onPress={() => onDelete(member.id)}
          >
            <Text style={[styles.buttonText, styles.deleteText]}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Affichage des préférences principales */}
      <View style={styles.preferencesContainer}>
        {getMainPreferences().map((pref, index) => (
          <View key={index} style={styles.preferenceChip}>
            <Text style={styles.preferenceText}>{pref}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteText: {
    color: '#FF3B30',
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  preferenceChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  preferenceText: {
    fontSize: 14,
    color: '#666',
  },
}); 