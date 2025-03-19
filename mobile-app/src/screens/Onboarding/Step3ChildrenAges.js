import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, SafeAreaView, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, commonStyles } from '../../styles/onboardingStyles';
import OnboardingButton from '../../components/OnboardingButton';

export default function Step3ChildrenAges() {
  const navigation = useNavigation();
  const route = useRoute();
  const [ages, setAges] = useState(Array(route.params.children).fill(""));

  const handleAgeChange = (index, value) => {
    const newAges = [...ages];
    newAges[index] = value.replace(/[^0-9]/g, '');
    if (newAges[index] !== "" && parseInt(newAges[index]) > 17) {
      newAges[index] = "17";
    }
    setAges(newAges);
  };

  const isValidAge = (age) => {
    return age !== "" && parseInt(age) >= 0 && parseInt(age) <= 17;
  };

  const handleNext = () => {
    if (ages.every(isValidAge)) {
      navigation.navigate("Step4TravelType", {
        ...route.params,
        childrenAges: ages.map(age => parseInt(age))
      });
    } else {
      Alert.alert(
        "Âges manquants",
        "Veuillez renseigner l'âge de chaque enfant (entre 0 et 17 ans)."
      );
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
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Composition familiale</Text>
        </View>
        <Text style={styles.headerSubtitle}>Quel âge ont vos enfants ?</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Âge des enfants</Text>
          </View>
          
          <View style={styles.inputsContainer}>
            {ages.map((age, index) => (
              <View key={index} style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>
                  Enfant {index + 1}
                </Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={age}
                    onChangeText={(value) => handleAgeChange(index, value)}
                    placeholder="Âge"
                    keyboardType="numeric"
                    maxLength={2}
                  />
                  <Text style={styles.inputSuffix}>ans</Text>
                </View>
              </View>
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
  inputsContainer: {
    padding: spacing.lg,
  },
  inputWrapper: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
  },
  inputSuffix: {
    ...typography.body,
    color: colors.text.secondary,
    marginLeft: spacing.md,
  },
  buttonContainer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
