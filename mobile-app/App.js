// App.js
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import AppNavigator from "./src/navigation/AppNavigator";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      // Simule un chargement
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setAppIsReady(true);
    })();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // Masque le splash
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={{
            uri: "https://espace-junglemail.aphp.fr/ImagesNord/LMR/Instagram-Logo.png",
          }}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  splashImage: {
    width: 200,
    height: 200,
  },
});
