import React, { useCallback, useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import OnboardingNavigator from "./src/navigation/OnboardingNavigator";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync(); // Bloque le Splash jusqu’à la fin du chargement

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Splash affiché 2s
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync(); // Cache le splash quand l'app est prête
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // Garde l’écran Splash jusqu’à ce que tout soit chargé
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <OnboardingNavigator />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
