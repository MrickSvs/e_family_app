import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, SafeAreaView, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, commonStyles } from '../../styles/onboardingStyles';
import OnboardingButton from '../../components/OnboardingButton';

export default function OnboardingWelcome() {
  const navigation = useNavigation();
  const [familyName, setFamilyName] = useState("");

  const handleStart = () => {
    if (familyName.trim().length < 2) {
      Alert.alert("Attention", "Merci de renseigner un nom de famille valide (minimum 2 caractères).");
      return;
    }
    navigation.navigate("Step1Adults", { familyName: familyName.trim() });
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.welcomeSection}>
          <Ionicons name="hand-left-outline" size={48} color={colors.primary} style={styles.welcomeIcon} />
          <Text style={styles.headerTitle}>Bienvenue</Text>
          <Text style={styles.headerSubtitle}>Commençons par faire connaissance</Text>
        </View>

        <View style={styles.familySection}>
          <View style={styles.familyTitleContainer}>
            <Text style={styles.sectionTitle}>Votre famille</Text>
            <Text style={styles.sectionSubtitle}>Comment souhaitez-vous être identifié ?</Text>
          </View>
          
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ex : Martin"
              placeholderTextColor={colors.text.placeholder}
              value={familyName}
              onChangeText={setFamilyName}
              autoCapitalize="words"
              autoCorrect={false}
            />
            <Ionicons 
              name="people-outline" 
              size={20} 
              color={colors.text.secondary}
              style={styles.inputIcon}
            />
          </View>
        </View>

        <View style={styles.infoSection}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.infoText}>Cette information nous permettra de personnaliser votre expérience</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="C'est parti !"
          onPress={handleStart}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'flex-start',
  },
  welcomeSection: {
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? spacing.xl : spacing.lg,
    marginBottom: spacing.xl,
  },
  welcomeIcon: {
    marginBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text.primary,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    fontSize: 16,
  },
  familySection: {
    marginTop: spacing.xl,
  },
  familyTitleContainer: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    fontSize: 14,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    paddingRight: spacing.xl * 2,
    fontSize: 18,
    color: colors.text.primary,
    width: '100%',
    height: 56,
  },
  inputIcon: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  infoText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
    flex: 1,
  },
  buttonContainer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});