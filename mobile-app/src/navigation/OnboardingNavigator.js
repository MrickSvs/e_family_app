import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingWelcome from "../screens/Onboarding/OnboardingWelcome";
import OnboardingFamilyInfo from "../screens/Onboarding/OnboardingFamilyInfo";
import OnboardingSummary from "../screens//Onboarding/OnboardingSummary";

const Stack = createStackNavigator();

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={OnboardingWelcome} />
      <Stack.Screen name="FamilyInfo" component={OnboardingFamilyInfo} />
      <Stack.Screen name="Summary" component={OnboardingSummary} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
