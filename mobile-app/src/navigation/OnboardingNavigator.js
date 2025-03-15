import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OnboardingWelcome from "../screens/Onboarding/OnboardingWelcome";
import Step1Adults from "../screens/Onboarding/Step1Adults";
import Step2Children from "../screens/Onboarding/Step2Children";
import Step3ChildrenAges from "../screens/Onboarding/Step3ChildrenAges";
import Step4TravelType from "../screens/Onboarding/Step4TravelType";
import Step5Budget from "../screens/Onboarding/Step5Budget";
import Step6Summary from "../screens/Onboarding/Step6Summary";

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={OnboardingWelcome} />
      <Stack.Screen name="Step1Adults" component={Step1Adults} />
      <Stack.Screen name="Step2Children" component={Step2Children} />
      <Stack.Screen name="Step3ChildrenAges" component={Step3ChildrenAges} />
      <Stack.Screen name="Step4TravelType" component={Step4TravelType} />
      <Stack.Screen name="Step5Budget" component={Step5Budget} />
      <Stack.Screen name="Step6Summary" component={Step6Summary} />
    </Stack.Navigator>
  );
}
