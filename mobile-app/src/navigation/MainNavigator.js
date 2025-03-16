import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FamilyTripsScreen from "../screens/FamilyTripsScreen";
import MyTripsScreen from "../screens/MyTripsScreen";
import AssistanceScreen from "../screens/AssistanceScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FamilyTripsScreen" component={FamilyTripsScreen} />
      <Stack.Screen name="MyTripsScreen" component={MyTripsScreen} />
      <Stack.Screen name="AssistanceScreen" component={AssistanceScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
