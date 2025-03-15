import OnboardingWelcome from "../screens/Onboarding/OnboardingWelcome";
import OnboardingFamilyInfo from "../screens/Onboarding/OnboardingFamilyInfo";
import OnboardingPreferences from "../screens/Onboarding/OnboardingPreferences";
import OnboardingSummary from "../screens/Onboarding/OnboardingSummary";
import { createNativeStackNavigator } from "@react-navigation/native-stack";



const Stack = createNativeStackNavigator();


const OnboardingNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={OnboardingWelcome} />
      <Stack.Screen name="FamilyInfo" component={OnboardingFamilyInfo} />
      <Stack.Screen name="Preferences" component={OnboardingPreferences} />
      <Stack.Screen name="Summary" component={OnboardingSummary} />
    </Stack.Navigator>
  );
};


export default OnboardingNavigator;
