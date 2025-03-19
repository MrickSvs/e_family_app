import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, SafeAreaView, Animated } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, commonStyles } from '../../styles/onboardingStyles';
import OnboardingButton from '../../components/OnboardingButton';

export default function Step2Children() {
  const navigation = useNavigation();
  const route = useRoute();
  const [children, setChildren] = useState(1);

  const handleIncrement = () => {
    if (children < 8) {
      setChildren(children + 1);
    }
  };

  const handleDecrement = () => {
    if (children > 0) {
      setChildren(children - 1);
    }
  };

  const handleNext = () => {
    if (children === 0) {
      navigation.navigate("Step4TravelType", {
        ...route.params,
        children,
        childrenAges: []
      });
    } else {
      navigation.navigate("Step3ChildrenAges", {
        ...route.params,
        children
      });
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
          <Text style={styles.headerTitle}>Composition familiale</Text>
        </View>
        <Text style={styles.headerSubtitle}>Combien d'enfants voyagent ?</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.pickerContainer}>
          <TouchableOpacity 
            style={[styles.pickerButton, children <= 0 && styles.pickerButtonDisabled]} 
            onPress={handleDecrement}
            disabled={children <= 0}
          >
            <MaterialCommunityIcons 
              name="minus" 
              size={32} 
              color={children <= 0 ? colors.text.disabled : colors.primary} 
            />
          </TouchableOpacity>

          <View style={styles.numberContainer}>
            <View style={styles.numberCircle}>
              <Text style={styles.numberText}>{children}</Text>
            </View>
            <Text style={styles.numberLabel}>
              {children === 0 ? 'enfant' : children === 1 ? 'enfant' : 'enfants'}
            </Text>
            <View style={styles.iconRow}>
              {[...Array(children)].map((_, index) => (
                <MaterialCommunityIcons
                  key={index}
                  name="account-child"
                  size={24}
                  color={colors.primary}
                  style={styles.personIcon}
                />
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.pickerButton, children >= 8 && styles.pickerButtonDisabled]} 
            onPress={handleIncrement}
            disabled={children >= 8}
          >
            <MaterialCommunityIcons 
              name="plus" 
              size={32} 
              color={children >= 8 ? colors.text.disabled : colors.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>

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
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: spacing.lg,
  },
  pickerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerButtonDisabled: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  numberContainer: {
    alignItems: 'center',
    marginHorizontal: spacing.xl,
  },
  numberCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.84,
    elevation: 5,
  },
  numberText: {
    ...typography.h1,
    fontSize: 36,
    color: colors.text.light,
    fontWeight: 'bold',
  },
  numberLabel: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: 200,
  },
  personIcon: {
    marginHorizontal: 4,
  },
  buttonContainer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});