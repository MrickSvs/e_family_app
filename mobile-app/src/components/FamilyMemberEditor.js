import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ROLES = ['Adulte', 'Enfant'];

export const FamilyMemberEditor = ({ member, visible, onSave, onClose }) => {
  const { colors } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    first_name: member?.first_name || '',
    last_name: member?.last_name || '',
    role: member?.role || 'Adulte',
    birth_date: member?.birth_date ? new Date(member.birth_date) : new Date(),
    dietary_restrictions: member?.dietary_restrictions || '',
    preferred_activities: member?.preferred_activities || []
  });

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        birth_date: selectedDate,
      }));
    }
  };

  const handleSave = () => {
    if (!formData.first_name.trim()) {
      Alert.alert('Erreur', 'Le prénom est obligatoire');
      return;
    }
    if (formData.role === 'Enfant' && !formData.birth_date) {
      Alert.alert('Erreur', 'La date de naissance est obligatoire pour un enfant');
      return;
    }
    onSave(formData);
  };

  const handleActivitiesChange = (text) => {
    setFormData(prev => ({
      ...prev,
      preferred_activities: text.split(',').map(activity => activity.trim()).filter(Boolean)
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {member ? 'Modifier le membre' : 'Nouveau membre'}
            </Text>
            <TouchableOpacity
              onPress={handleSave}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.container}>
            <View style={styles.section}>
              <Text style={styles.label}>Prénom *</Text>
              <TextInput
                style={styles.input}
                value={formData.first_name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, first_name: text }))}
                placeholder="Prénom"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Nom</Text>
              <TextInput
                style={styles.input}
                value={formData.last_name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, last_name: text }))}
                placeholder="Nom"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Rôle *</Text>
              <View style={styles.chipContainer}>
                {ROLES.map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.chip,
                      formData.role === role && styles.chipSelected
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, role }))}
                  >
                    <Text style={[
                      styles.chipText,
                      formData.role === role && styles.chipTextSelected
                    ]}>
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>
                Date de naissance {formData.role === 'Enfant' ? '*' : ''}
              </Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {formData.birth_date.toLocaleDateString()}
                </Text>
                <Ionicons name="calendar" size={20} color={colors.text} />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={formData.birth_date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}

              <Text style={styles.label}>Restrictions alimentaires</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.dietary_restrictions}
                onChangeText={(text) => setFormData(prev => ({ ...prev, dietary_restrictions: text }))}
                placeholder="Allergies, régimes spéciaux..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <Text style={styles.label}>Activités préférées</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.preferred_activities.join(', ')}
                onChangeText={handleActivitiesChange}
                placeholder="Activités (séparées par des virgules)"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#0f8066',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
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
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
  },
}); 