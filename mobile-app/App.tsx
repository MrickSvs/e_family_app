import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

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
import MessagerieScreen from './src/screens/MessagerieScreen';
import ConversationDetailScreen from './src/screens/ConversationDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UpcomingTripDetailScreen from './src/screens/UpcomingTripDetailScreen';
import PastTripDetailScreen from './src/screens/PastTripDetailScreen';
import TripDetailScreen from './src/screens/TripDetailScreen';
import CurrentTripDetailScreen from './src/screens/CurrentTripDetailScreen';
import PendingQuoteDetailScreen from './src/screens/PendingQuoteDetailScreen';

const OnboardingStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const MyTripsStack = createNativeStackNavigator();

// Navigateur d'onboarding
function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: false
      }}
    >
      <OnboardingStack.Screen name="OnboardingWelcome" component={OnboardingWelcome} />
      <OnboardingStack.Screen name="Step1Adults" component={Step1Adults} />
      <OnboardingStack.Screen name="Step2Children" component={Step2Children} />
      <OnboardingStack.Screen name="Step3ChildrenAges" component={Step3ChildrenAges} />
      <OnboardingStack.Screen name="Step4TravelType" component={Step4TravelType} />
      <OnboardingStack.Screen name="Step5Budget" component={Step5Budget} />
      <OnboardingStack.Screen name="Step6Summary" component={Step6Summary} />
    </OnboardingStack.Navigator>
  );
}

// Navigateur pour la section Mes Voyages
function MyTripsNavigator() {
  return (
    <MyTripsStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <MyTripsStack.Screen name="MyTripsList" component={MyTripsScreen} />
      <MyTripsStack.Screen name="UpcomingTripDetail" component={UpcomingTripDetailScreen} />
      <MyTripsStack.Screen name="PastTripDetail" component={PastTripDetailScreen} />
      <MyTripsStack.Screen name="CurrentTripDetail" component={CurrentTripDetailScreen} />
      <MyTripsStack.Screen name="PendingQuoteDetail" component={PendingQuoteDetailScreen} />
    </MyTripsStack.Navigator>
  );
}

// Navigateur principal avec les onglets
function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'FamilyTrips') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'MyTrips') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Messagerie') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
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
        name="FamilyTrips" 
        component={FamilyTripsScreen}
        options={{ tabBarLabel: 'Itinéraires' }}
      />
      <Tab.Screen 
        name="MyTrips" 
        component={MyTripsNavigator}
        options={{ tabBarLabel: 'Mes Voyages' }}
      />
      <Tab.Screen 
        name="Messagerie" 
        component={MessagerieScreen}
        options={{ tabBarLabel: 'Messagerie' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          tabBarLabel: 'Profil',
          title: 'Mon Profil'
        }}
      />
    </Tab.Navigator>
  );
}

// Stack principal qui contient l'onboarding et le navigateur principal
function RootNavigator() {
  return (
    <MainStack.Navigator
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: false
      }}
    >
      <MainStack.Screen name="Onboarding" component={OnboardingNavigator} />
      <MainStack.Screen name="Main" component={MainNavigator} />
      <MainStack.Screen name="TripDetail" component={TripDetailScreen} />
    </MainStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
} 