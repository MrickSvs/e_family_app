// src/navigation/AppNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingNavigator from "./OnboardingNavigator";
import MainNavigator from "./MainNavigator";

const RootStack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {/*
        OnboardingNavigator gère tout le parcours Welcome -> Step6
      */}
      <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />

      {/*
        MainNavigator gère toute l'app post-onboarding
        (FamilyTripsScreen, MyTripsScreen, AssistanceScreen, ProfileScreen, FamilyProfile...)
      */}
      <RootStack.Screen name="Main" component={MainNavigator} />
    </RootStack.Navigator>
  );
}
