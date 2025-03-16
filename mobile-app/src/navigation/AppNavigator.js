import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingNavigator from "./OnboardingNavigator";
import MainNavigator from "./MainNavigator";
import FamilyTripsScreen from "../screens/FamilyTripsScreen"; 

const RootStack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
      <RootStack.Screen name="FamilyTripsScreen" component={FamilyTripsScreen} /> 
      <RootStack.Screen name="Main" component={MainNavigator} />
    </RootStack.Navigator>
  );
}
