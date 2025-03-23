import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface FamilyBasicInfoData {
  familyName: string;
  description: string;
}

interface FamilyBasicInfoProps {
  data: FamilyBasicInfoData;
  onUpdate: (data: FamilyBasicInfoData) => void;
  onNext: () => void;
}

export const FamilyBasicInfo: React.FC<FamilyBasicInfoProps> = ({
  data,
  onUpdate,
  onNext,
}) => {
  const [formData, setFormData] = useState<FamilyBasicInfoData>(data);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.familyName.trim()) {
      newErrors.familyName = 'Le nom de famille est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onUpdate(formData);
      onNext();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informations de base</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nom de la famille</Text>
        <TextInput
          style={[styles.input, errors.familyName && styles.inputError]}
          value={formData.familyName}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, familyName: text }))
          }
          placeholder="Ex: Les Dupont"
        />
        {errors.familyName && (
          <Text style={styles.errorText}>{errors.familyName}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, description: text }))
          }
          placeholder="Décrivez votre famille en quelques mots..."
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Suivant</Text>
      </TouchableOpacity>
    </View>
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#0f8066',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 