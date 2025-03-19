import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, SafeAreaView } from "react-native";
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
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Bienvenue</Text>
        </View>
        <Text style={styles.headerSubtitle}>Commençons par faire connaissance</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Votre famille</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Ionicons name="home" size={20} color={colors.text.secondary} />
              <Text style={styles.inputLabel}>Nom de famille</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Ex : Martin"
              placeholderTextColor={colors.text.placeholder}
              value={familyName}
              onChangeText={setFamilyName}
              autoCapitalize="words"
              autoCorrect={false}
            />
            <Text style={styles.inputHelper}>
              Ce nom sera utilisé pour identifier votre famille
            </Text>
          </View>
        </View>

        <View style={styles.welcomeMessage}>
          <Ionicons name="information-circle" size={24} color={colors.primary} />
          <Text style={styles.welcomeText}>
            Nous allons vous aider à organiser des voyages parfaitement adaptés à votre famille.
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="Commencer"
          onPress={handleStart}
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
  inputContainer: {
    padding: spacing.lg,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  inputLabel: {
    ...typography.body,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  inputHelper: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  welcomeMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    ...typography.body,
    color: colors.text.secondary,
    flex: 1,
    marginLeft: spacing.md,
  },
  buttonContainer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});