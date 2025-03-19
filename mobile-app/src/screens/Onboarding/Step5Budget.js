import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, SafeAreaView, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, commonStyles } from '../../styles/onboardingStyles';
import OnboardingButton from '../../components/OnboardingButton';

const budgetOptions = [
  { 
    id: 'ECONOMY', 
    label: 'Économique', 
    description: 'Moins de 1000€ par personne',
    icon: 'wallet'
  },
  { 
    id: 'MODERATE', 
    label: 'Modéré', 
    description: '1000€ - 2000€ par personne',
    icon: 'cash-multiple'
  },
  { 
    id: 'LUXURY', 
    label: 'Luxe', 
    description: 'Plus de 2000€ par personne',
    icon: 'diamond-stone'
  },
];

export default function Step5Budget() {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedBudget, setSelectedBudget] = useState(null);

  const handleNext = () => {
    if (!selectedBudget) {
      Alert.alert(
        "Sélection requise",
        "Veuillez sélectionner une fourchette de budget."
      );
      return;
    }
    navigation.navigate("Step6Summary", {
      ...route.params,
      budget: selectedBudget
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
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Budget</Text>
        </View>
        <Text style={styles.headerSubtitle}>Quel est votre budget par personne ?</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="wallet" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Fourchette de budget</Text>
          </View>
          
          <View style={styles.optionsContainer}>
            {budgetOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  selectedBudget === option.id && styles.optionCardSelected
                ]}
                onPress={() => setSelectedBudget(option.id)}
              >
                <View style={[
                  styles.optionIconContainer,
                  selectedBudget === option.id && styles.optionIconContainerSelected
                ]}>
                  <MaterialCommunityIcons
                    name={option.icon}
                    size={28}
                    color={selectedBudget === option.id ? colors.text.light : colors.primary}
                  />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[
                    styles.optionTitle,
                    selectedBudget === option.id && styles.optionTitleSelected
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    selectedBudget === option.id && styles.optionDescriptionSelected
                  ]}>
                    {option.description}
                  </Text>
                </View>
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
    paddingTop: Platform.OS === 'android' ? spacing.xl : spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.md,
    marginLeft: -spacing.sm,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  contentContainer: {
    flex: 1,
    padding: spacing.lg,
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
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginLeft: spacing.md,
  },
  optionsContainer: {
    padding: spacing.lg,
  },
  optionCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  optionIconContainerSelected: {
    backgroundColor: 'transparent',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  optionTitleSelected: {
    color: colors.text.light,
  },
  optionDescription: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  optionDescriptionSelected: {
    color: colors.text.light,
  },
  buttonContainer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
