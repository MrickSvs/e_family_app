import React, { FC } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { ParamListBase } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Écrans d'onboarding
import OnboardingWelcome from './src/screens/Onboarding/OnboardingWelcome';
import Step1Adults from './src/screens/Onboarding/Step1Adults';
import Step2Children from './src/screens/Onboarding/Step2Children';
import Step3ChildrenAges from './src/screens/Onboarding/Step3ChildrenAges';
import Step4TravelType from './src/screens/Onboarding/Step4TravelType';
import Step5Budget from './src/screens/Onboarding/Step5Budget';
import Step6Summary from './src/screens/Onboarding/Step6Summary';

// Écrans principaux
import FamilyTripsScreen from './src/screens/FamilyTripsScreen';
import MyTripsScreen from './src/screens/MyTripsScreen';
import AssistanceScreen from './src/screens/AssistanceScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import UpcomingTripDetailScreen from './src/screens/UpcomingTripDetailScreen';
import PastTripDetailScreen from './src/screens/PastTripDetailScreen';
import TripDetailScreen from './src/screens/TripDetailScreen';
import ItineraryListScreen from './src/screens/ItineraryListScreen';

// ... existing code ...

// Navigateur principal avec les onglets
function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'ItineraryList') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'FamilyTrips') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'MyTrips') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Assistance') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0f8066',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="ItineraryList" 
        component={ItineraryListScreen}
        options={{ tabBarLabel: 'Découvrir' }}
      />
      <Tab.Screen 
        name="FamilyTrips" 
        component={FamilyTripsScreen}
        options={{ tabBarLabel: 'Mes Voyages' }}
      />
      <Tab.Screen 
        name="MyTrips" 
        component={MyTripsNavigator}
        options={{ tabBarLabel: 'Mes Voyages' }}
      />
      <Tab.Screen 
        name="Assistance" 
        component={AssistanceScreen}
        options={{ tabBarLabel: 'Assistance' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
}

// ... rest of the code ... 