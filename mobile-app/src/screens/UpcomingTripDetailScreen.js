import React, { useState } from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  TextInput,
  StyleSheet
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // ou autre lib d'icônes
import AgencyBlock from "../components/AgencyBlock";
  
export default function UpcomingTripDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { tripId, title, date, imageUrl } = route.params || {};

  // Exemple de checklist (une vraie app stockerait ça dans un backend ou AsyncStorage)
  const [checklist, setChecklist] = useState([
    { id: 1, label: "Réserver billets d'avion", done: false },
    { id: 2, label: "Faire visas / ESTA", done: false },
    { id: 3, label: "Assurance voyage", done: false },
    { id: 4, label: "Préparer la valise", done: false },
    { id: 5, label: "Vaccin enfant", done: false },
    { id: 6, label: "Adaptateurs secteur (Costa Rica utilise prises US)", done: false },
    { id: 7, label: "Trousse d'activités Evaneos Explorateur en herbe", done: true },
    
    
  ]);

  // Ajout de documents (simple placeholder)
  const [documents, setDocuments] = useState([
    { id: 1, name: "Billets Avion.pdf" },
    { id: 2, name: "Réservation Hôtel.pdf" },
    { id: 3, name: "Permis International.pdf" },
  ]);

  // Calcul de la progression
  const totalTasks = checklist.length;
  const tasksDone = checklist.filter((item) => item.done).length;
  const progress = totalTasks > 0 ? (tasksDone / totalTasks) * 100 : 0;

  // Fonctions
  const toggleTask = (taskId) => {
    setChecklist((prev) =>
      prev.map((task) => 
        task.id === taskId ? { ...task, done: !task.done } : task
      )
    );
  };

  const addDocument = () => {
    // Placeholder : on ajoute un doc fictif
    const newId = documents.length + 1;
    setDocuments((prev) => [...prev, { id: newId, name: `NouveauDoc${newId}.pdf` }]);
  };

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
          <Image source={{ uri: imageUrl }} style={styles.bannerImage} />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>{title}</Text>
            <Text style={styles.bannerDates}>{date}</Text>

            {/* Barre de progression */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressLabel}>
              Checklist : {tasksDone}/{totalTasks} ({Math.round(progress)}%)
            </Text>
          </View>
        </View>

        {/* Section : Checklist */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Checklist & Documents</Text>

          {/* Checklist */}
          {checklist.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.checkItem} 
              onPress={() => toggleTask(item.id)}
            >
              <Ionicons 
                name={item.done ? "checkbox-outline" : "square-outline"} 
                size={24} 
                color={item.done ? "#0f8066" : "#999"} 
                style={{ marginRight: 8 }}
              />
              <Text style={item.done ? styles.checkItemDone : styles.checkItemLabel}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Documents */}
          <View style={{ marginTop: 15 }}>
            <Text style={styles.docsTitle}>Documents de voyage</Text>
            {documents.map((doc) => (
              <View key={doc.id} style={styles.docRow}>
                <Ionicons name="document-text-outline" size={20} color="#555" style={{ marginRight: 8 }} />
                <Text style={styles.docName}>{doc.name}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.addDocButton} onPress={addDocument}>
              <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.addDocText}>Ajouter un document</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section : Itinéraire & Infos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itinéraire & Infos</Text>
          <Text style={styles.infoText}>
            Jour 1 : Vol depuis Paris vers Los Angeles, prise en main de la voiture.{"\n"}
            Jour 2 : Visite de Santa Monica, Venice Beach.{"\n"}
            Jour 3 : Route vers Joshua Tree...{"\n"}
            ...
          </Text>

          <Text style={[styles.infoText, { marginTop: 10 }]}>
            Téléphone d'urgence : +1 234 567 890{"\n"}
            Monnaie : Dollar américain (USD){"\n"}
            Météo estimée : 25-30°C
          </Text>
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
  progressContainer: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#0f8066",
  },
  progressLabel: {
    marginTop: 8,
    fontSize: 13,
    color: "#666",
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

  // Checklist
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkItemLabel: {
    fontSize: 14,
    color: "#333",
  },
  checkItemDone: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },

  // Documents
  docsTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  docName: {
    fontSize: 14,
    color: "#333",
  },
  addDocButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f8066",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  addDocText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Infos
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
});