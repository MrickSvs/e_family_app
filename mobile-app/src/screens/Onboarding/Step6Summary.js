import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, SafeAreaView, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, commonStyles } from '../../styles/onboardingStyles';
import OnboardingButton from '../../components/OnboardingButton';

export default function Step6Summary() {
  const navigation = useNavigation();
  const route = useRoute();
  const { familyName, adults, children, childrenAges, travel_preferences, budget } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      // Simulation d'un délai pour montrer le loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la création de votre famille. Veuillez réessayer.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getBudgetLabel = (budgetId) => {
    switch (budgetId) {
      case 'ECONOMY': return 'Économique (Moins de 1000€ par personne)';
      case 'MODERATE': return 'Modéré (1000€ - 2000€ par personne)';
      case 'LUXURY': return 'Luxe (Plus de 2000€ par personne)';
      default: return budgetId;
    }
  };

  const getBudgetIcon = (budgetId) => {
    switch (budgetId) {
      case 'ECONOMY': return 'wallet';
      case 'MODERATE': return 'cash-multiple';
      case 'LUXURY': return 'diamond-stone';
      default: return 'wallet';
    }
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
          <Text style={styles.headerTitle}>Récapitulatif</Text>
        </View>
        <Text style={styles.headerSubtitle}>Vérifiez les informations de votre famille</Text>
      </View>

      <View style={styles.contentContainer}>
        {/* Famille */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons name="account-group" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Composition familiale</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nom</Text>
            <Text style={styles.infoValue}>{familyName}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Adultes</Text>
            <View style={styles.countContainer}>
              <MaterialCommunityIcons name="account" size={20} color={colors.primary} />
              <Text style={styles.infoValue}>{adults}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Enfants</Text>
            <View style={styles.countContainer}>
              <MaterialCommunityIcons name="account-child" size={20} color={colors.primary} />
              <Text style={styles.infoValue}>{children}</Text>
            </View>
          </View>
          
          {children > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Âges</Text>
              <View style={styles.agesContainer}>
                {childrenAges.map((age, index) => (
                  <Text key={index} style={styles.ageText}>
                    {index > 0 ? ' • ' : ''}{age} ans
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Préférences */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons name="airplane" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Préférences de voyage</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Types</Text>
            <View style={styles.preferencesContainer}>
              {travel_preferences.map((pref, index) => (
                <Text key={index} style={styles.preferenceText}>
                  {index > 0 ? ' • ' : ''}{pref}
                </Text>
              ))}
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Budget</Text>
            <View style={styles.budgetContainer}>
              <MaterialCommunityIcons 
                name={getBudgetIcon(budget)} 
                size={20} 
                color={colors.primary}
              />
              <Text style={styles.budgetText}>{getBudgetLabel(budget)}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="Créer ma famille"
          onPress={handleSubmit}
          loading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'android' ? spacing.xl : spacing.lg,
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
  },
  contentContainer: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-evenly',
  },
  section: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    ...typography.body,
    fontSize: 16,
    color: colors.text.secondary,
  },
  infoValue: {
    ...typography.body,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}10`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  agesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  ageText: {
    ...typography.body,
    fontSize: 16,
    color: colors.primary,
  },
  preferencesContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  preferenceText: {
    ...typography.body,
    fontSize: 16,
    color: colors.primary,
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}10`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  budgetText: {
    ...typography.body,
    fontSize: 16,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  buttonContainer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
