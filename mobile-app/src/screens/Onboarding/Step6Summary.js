import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, SafeAreaView, ScrollView, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, commonStyles } from '../../styles/onboardingStyles';
import OnboardingButton from '../../components/OnboardingButton';

export default function Step6Summary() {
  const navigation = useNavigation();
  const route = useRoute();
  const { familyName, adults, children, childrenAges, travel_preferences, budget } = route.params;

  const handleSubmit = () => {
    // TODO: Envoyer les données au backend
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
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

      <ScrollView style={styles.contentContainer}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="account-group" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Composition familiale</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nom de la famille</Text>
              <Text style={styles.infoValue}>{familyName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre d'adultes</Text>
              <Text style={styles.infoValue}>{adults}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre d'enfants</Text>
              <Text style={styles.infoValue}>{children}</Text>
            </View>
            {children > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Âges des enfants</Text>
                <Text style={styles.infoValue}>{childrenAges.join(', ')} ans</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="airplane" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Préférences de voyage</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Types de voyages</Text>
              <Text style={styles.infoValue}>{travel_preferences.join(', ')}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.budgetRow}>
                <MaterialCommunityIcons 
                  name={getBudgetIcon(budget)} 
                  size={24} 
                  color={colors.primary}
                  style={styles.budgetIcon}
                />
                <Text style={styles.infoValue}>{getBudgetLabel(budget)}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="Créer ma famille"
          onPress={handleSubmit}
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
    marginBottom: spacing.lg,
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
  sectionContent: {
    padding: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetIcon: {
    marginRight: spacing.sm,
  },
  infoLabel: {
    ...typography.body,
    color: colors.text.secondary,
    flex: 1,
  },
  infoValue: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    textAlign: 'right',
  },
  buttonContainer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
