// src/components/Navbar.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Navbar() {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("FamilyTripsScreen")}>
        <Ionicons name="map-outline" size={24} color="#0f8066" />
        <Text style={styles.navText}>Itinéraires</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("MyTripsScreen")}>
        <Ionicons name="calendar-outline" size={24} color="#0f8066" />
        <Text style={styles.navText}>Mes Voyages</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("AssistanceScreen")}>
        <Ionicons name="help-circle-outline" size={24} color="#0f8066" />
        <Text style={styles.navText}>Assistance</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("ProfileScreen")}>
        <Ionicons name="person-circle-outline" size={24} color="#0f8066" />
        <Text style={styles.navText}>Profil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    marginTop: 2,
    color: "#0f8066",
  },
});
