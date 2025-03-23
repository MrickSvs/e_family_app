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
    <Stack.Navigator>
      {/* Écran principal, affiché par défaut quand on rentre dans Main */}
      <Stack.Screen 
        name="FamilyTripsScreen" 
        component={FamilyTripsScreen}
        options={{ headerShown: false }}
      />

      {/* Les autres écrans du menu */}
      <Stack.Screen 
        name="MyTripsScreen" 
        component={MyTripsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AssistanceScreen" 
        component={AssistanceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      
      {/* Écran de profil détaillé */}
      <Stack.Screen 
        name="FamilyProfile" 
        component={FamilyProfileScreen}
        options={{
          headerShown: true,
          title: 'Profil Familial',
          headerBackTitle: 'Retour'
        }}
      />

      {/* Écran de détail des itinéraires */}
      <Stack.Screen 
        name="TripDetail" 
        component={TripDetailScreen}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
}

// Navigateur pour la section Mes Voyages
export function MyTripsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MyTripsList" component={MyTripsScreen} />
      <Stack.Screen name="UpcomingTripDetail" component={UpcomingTripDetailScreen} />
      <Stack.Screen name="PastTripDetail" component={PastTripDetailScreen} />
      <Stack.Screen name="CurrentTripDetail" component={CurrentTripDetailScreen} />
      <Stack.Screen name="PendingQuoteDetail" component={PendingQuoteDetailScreen} />
    </Stack.Navigator>
  );
}
