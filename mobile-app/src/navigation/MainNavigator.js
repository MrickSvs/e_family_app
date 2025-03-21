import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FamilyTripsScreen from "../screens/FamilyTripsScreen";
import MyTripsScreen from "../screens/MyTripsScreen";
import AssistanceScreen from "../screens/AssistanceScreen";
import ProfileScreen from "../screens/ProfileScreen";
import FamilyProfileScreen from "../screens/FamilyProfileScreen";
import UpcomingTripDetailScreen from "../screens/UpcomingTripDetailScreen";
import PastTripDetailScreen from "../screens/PastTripDetailScreen";
import TripDetailScreen from "../screens/TripDetailScreen";
import CurrentTripDetailScreen from "../screens/CurrentTripDetailScreen";
import PendingQuoteDetailScreen from "../screens/PendingQuoteDetailScreen";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Écran principal, affiché par défaut quand on rentre dans Main */}
      <Stack.Screen name="FamilyTripsScreen" component={FamilyTripsScreen} />

      {/* Les autres écrans du menu */}
      <Stack.Screen name="MyTripsScreen" component={MyTripsScreen} />
      <Stack.Screen name="AssistanceScreen" component={AssistanceScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      
      {/* Wizard de complétion */}
      <Stack.Screen name="FamilyProfile" component={FamilyProfileScreen} />

      {/* Ecrans de voyage */}
      <Stack.Screen name="UpcomingTripDetail" component={UpcomingTripDetailScreen} />
      <Stack.Screen name="PastTripDetail" component={PastTripDetailScreen} />
      <Stack.Screen name="TripDetail" component={TripDetailScreen} />
      <Stack.Screen name="CurrentTripDetail" component={CurrentTripDetailScreen} />
      <Stack.Screen name="PendingQuoteDetail" component={PendingQuoteDetailScreen} />
    </Stack.Navigator>
  );
}
