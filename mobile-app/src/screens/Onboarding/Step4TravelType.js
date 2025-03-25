import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, SafeAreaView, ScrollView, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, commonStyles } from '../../styles/onboardingStyles';
import OnboardingButton from '../../components/OnboardingButton';

const travelTypes = [
  { id: 'Culture', label: 'Culture', icon: 'book', description: 'Musées, histoire, patrimoine' },
  { id: 'Nature', label: 'Nature', icon: 'leaf', description: 'Randonnées, parcs naturels' },
  { id: 'Plage', label: 'Plage', icon: 'sunny', description: 'Mer, sable, détente' },
  { id: 'Sport', label: 'Sport', icon: 'bicycle', description: 'Activités sportives' },
  { id: 'Découverte', label: 'Découverte', icon: 'compass', description: 'Exploration, aventure' },
  { id: 'Détente', label: 'Détente', icon: 'bed', description: 'Repos, bien-être' },
  { id: 'Aventure', label: 'Aventure', icon: 'trekking', description: 'Activités intenses' },
  { id: 'Non spécifié', label: 'Non spécifié', icon: 'help-circle', description: 'À définir plus tard' }
];

export default function Step4TravelType() {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedTypes, setSelectedTypes] = useState([]);

  const toggleType = (typeId) => {
    if (selectedTypes.includes(typeId)) {
      setSelectedTypes(selectedTypes.filter(id => id !== typeId));
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };

  const handleNext = () => {
    if (selectedTypes.length === 0) {
      Alert.alert(
        "Sélection requise",
        "Veuillez sélectionner au moins un type de voyage."
      );
      return;
    }
    navigation.navigate("Step5Budget", {
      ...route.params,
      travel_preferences: selectedTypes
    });
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Préférences de voyage</Text>
        </View>
        <Text style={styles.headerSubtitle}>Quels types de voyages vous intéressent ?</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="airplane" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Types de voyages</Text>
          </View>
          
          <View style={styles.optionsContainer}>
            {travelTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.optionCard,
                  selectedTypes.includes(type.id) && styles.optionCardSelected
                ]}
                onPress={() => toggleType(type.id)}
              >
                <View style={[
                  styles.optionIcon,
                  selectedTypes.includes(type.id) && styles.optionIconSelected
                ]}>
                  <Ionicons
                    name={type.icon}
                    size={28}
                    color={selectedTypes.includes(type.id) ? colors.text.light : colors.primary}
                  />
                </View>
                <Text style={[
                  styles.optionTitle,
                  selectedTypes.includes(type.id) && styles.optionTitleSelected
                ]}>
                  {type.label}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  selectedTypes.includes(type.id) && styles.optionDescriptionSelected
                ]}>
                  {type.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="Continuer"
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'android' ? spacing.md : spacing.sm,
    paddingBottom: spacing.xs,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
    marginLeft: -spacing.xs,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text.primary,
    fontSize: 24,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  section: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginLeft: spacing.sm,
    fontSize: 18,
  },
  optionsContainer: {
    padding: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  optionCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  optionIconSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  optionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: 2,
    textAlign: 'center',
    fontSize: 14,
  },
  optionTitleSelected: {
    color: colors.text.light,
  },
  optionDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 14,
  },
  optionDescriptionSelected: {
    color: colors.text.light,
  },
  buttonContainer: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
