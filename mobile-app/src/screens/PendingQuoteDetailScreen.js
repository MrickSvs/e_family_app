import React, { useState } from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StyleSheet
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AgencyBlock from "../components/AgencyBlock";

export default function PendingQuoteDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { trip } = route.params || {};

  console.log('PendingQuoteDetailScreen - route.params:', route.params);
  console.log('PendingQuoteDetailScreen - trip:', trip);

  if (!trip) {
    console.error('Aucun voyage fourni dans les paramètres');
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.section, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={styles.errorText}>Impossible de charger les détails du devis</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Exemple de données pour le devis en attente
  const [quoteDetails] = useState({
    status: "En cours de préparation",
    lastUpdate: "Il y a 2 jours",
    estimatedPrice: "À partir de 3500€",
    travelDates: "15-30 Septembre 2024",
    travelers: "4 personnes",
    preferences: [
      "Hébergement confortable",
      "Transport privé",
      "Guide francophone",
      "Activités adaptées aux enfants"
    ]
  });

  // Exemple de messages avec l'agence
  const [messages] = useState([
    {
      id: 1,
      type: "agency",
      content: "Bonjour ! Je suis en train de préparer votre devis pour le Vietnam. Avez-vous des préférences particulières pour l'hébergement ?",
      date: "Il y a 3 jours"
    },
    {
      id: 2,
      type: "user",
      content: "Bonjour ! Nous préférons des hôtels confortables avec piscine pour les enfants.",
      date: "Il y a 2 jours"
    }
  ]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Bannière */}
        <View style={styles.banner}>
          <Image source={{ uri: trip.imageUrl }} style={styles.bannerImage} />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>{trip.title}</Text>
            <Text style={styles.bannerDates}>{trip.date}</Text>
          </View>
        </View>

        {/* Section : Statut du devis */}
        <View style={styles.section}>
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Ionicons name="time-outline" size={24} color="#FFA500" />
              <Text style={styles.statusTitle}>{quoteDetails.status}</Text>
            </View>
            <Text style={styles.statusSubtitle}>
              Dernière mise à jour : {quoteDetails.lastUpdate}
            </Text>
          </View>
        </View>

        {/* Section : Détails du voyage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails du voyage</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.detailText}>Dates : {quoteDetails.travelDates}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="people-outline" size={20} color="#666" />
              <Text style={styles.detailText}>Voyageurs : {quoteDetails.travelers}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={20} color="#666" />
              <Text style={styles.detailText}>Prix estimé : {quoteDetails.estimatedPrice}</Text>
            </View>
          </View>
        </View>

        {/* Section : Préférences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vos préférences</Text>
          <View style={styles.preferencesCard}>
            {quoteDetails.preferences.map((pref, index) => (
              <View key={index} style={styles.preferenceItem}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#0f8066" />
                <Text style={styles.preferenceText}>{pref}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section : Messages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Messages avec l'agence</Text>
          {messages.map((message) => (
            <View 
              key={message.id} 
              style={[
                styles.messageCard,
                message.type === "user" ? styles.userMessage : styles.agencyMessage
              ]}
            >
              <Text style={styles.messageContent}>{message.content}</Text>
              <Text style={styles.messageDate}>{message.date}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.addMessageButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#fff" />
            <Text style={styles.addMessageText}>Envoyer un message</Text>
          </TouchableOpacity>
        </View>

        <AgencyBlock 
          agency={{
            name: "L'agence de Virginie",
            imageUrl: "https://static1.evcdn.net/images/reduction/1649071_w-768_h-1024_q-70_m-crop.jpg",
            rating: 4.5,
            reviewCount: 75,
            tags: ["Famille avec enfants", "Incontournables"],
            memberSince: "1 an",
            experience: "3 ans",
            languages: ["Espagnol", "Français"],
            location: "Espagne"
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  banner: {
    backgroundColor: "#F7F5ED",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  bannerImage: {
    width: "100%",
    height: 180,
  },
  bannerTextContainer: {
    padding: 16,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  bannerDates: {
    fontSize: 14,
    color: "#555",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  statusCard: {
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    padding: 16,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFA500",
    marginLeft: 8,
  },
  statusSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  detailsCard: {
    backgroundColor: "#F7F5ED",
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  preferencesCard: {
    backgroundColor: "#F7F5ED",
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  preferenceText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  messageCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "#0f8066",
    alignSelf: "flex-end",
  },
  agencyMessage: {
    backgroundColor: "#F7F5ED",
    alignSelf: "flex-start",
  },
  messageContent: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
  },
  messageDate: {
    fontSize: 12,
    color: "#rgba(255,255,255,0.7)",
  },
  addMessageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f8066",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  addMessageText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
}); 