// src/navigation/AppNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingNavigator from "./OnboardingNavigator";
import MainNavigator from "./MainNavigator";
import { FamilyProfileScreen } from '../screens/FamilyProfileScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/*
        OnboardingNavigator gère tout le parcours Welcome -> Step6
      */}
      <Stack.Screen name="Onboarding" component={OnboardingNavigator} />

      {/*
        MainNavigator gère toute l'app post-onboarding
        (FamilyTripsScreen, MyTripsScreen, AssistanceScreen, ProfileScreen, FamilyProfile...)
      */}
      <Stack.Screen name="Main" component={MainNavigator} />

      <Stack.Screen
        name="FamilyProfile"
        component={FamilyProfileScreen}
        options={{
          title: 'Profil Familial',
          headerBackTitle: 'Retour',
        }}
      />
    </Stack.Navigator>
  );
}
