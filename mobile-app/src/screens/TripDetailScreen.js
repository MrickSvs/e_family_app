import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AgencyBlock from "../components/AgencyBlock";

const { width } = Dimensions.get("window");

export default function TripDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { trip, isPast } = route.params;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const renderUpcomingTripDetails = () => (
    <>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{trip.price}</Text>
        <Text style={styles.priceDetails}>{trip.priceDetails}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>À propos de ce voyage</Text>
        <Text style={styles.description}>{trip.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Points forts</Text>
        <View style={styles.highlightsContainer}>
          {trip.tags?.map((tag, index) => (
            <View key={index} style={styles.highlightItem}>
              <Text style={styles.highlightText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {trip.itinerary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Programme détaillé</Text>
          <View style={styles.itineraryContainer}>
            {trip.itinerary.map((day, index) => (
              <View key={index} style={styles.dayContainer}>
                <Text style={styles.dayNumber}>Jour {day.day}</Text>
                <Text style={styles.dayTitle}>{day.title}</Text>
                <Text style={styles.dayDescription}>{day.description}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {trip.practicalInfo && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations pratiques</Text>
          <View style={styles.practicalInfoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Niveau de difficulté</Text>
              <Text style={styles.infoValue}>{trip.practicalInfo.difficulty}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Transport</Text>
              <Text style={styles.infoValue}>{trip.practicalInfo.transport}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Hébergement</Text>
              <Text style={styles.infoValue}>{trip.practicalInfo.accommodation}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Repas</Text>
              <Text style={styles.infoValue}>{trip.practicalInfo.meals}</Text>
            </View>
          </View>

          <View style={styles.includedContainer}>
            <Text style={styles.includedTitle}>Ce qui est inclus</Text>
            {trip.practicalInfo.included.map((item, index) => (
              <View key={index} style={styles.includedItem}>
                <Text style={styles.includedText}>✓ {item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.includedContainer}>
            <Text style={styles.includedTitle}>Ce qui n'est pas inclus</Text>
            {trip.practicalInfo.notIncluded.map((item, index) => (
              <View key={index} style={styles.includedItem}>
                <Text style={styles.includedText}>✗ {item}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

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
    </>
  );

  const renderPastTripDetails = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>À propos de ce voyage</Text>
        <Text style={styles.description}>{trip.description}</Text>
      </View>

      {trip.gallery && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Galerie photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trip.gallery.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.galleryImage}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {trip.highlights && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Points forts</Text>
          <View style={styles.highlightsContainer}>
            {trip.highlights.map((highlight, index) => (
              <View key={index} style={styles.highlightItem}>
                <Text style={styles.highlightText}>{highlight}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {trip.memories && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Souvenirs mémorables</Text>
          {trip.memories.map((memory, index) => (
            <View key={index} style={styles.memoryItem}>
              <Text style={styles.memoryTitle}>{memory.title}</Text>
              <Text style={styles.memoryDescription}>{memory.description}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Note globale</Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, i) => (
            <Text key={i} style={styles.ratingStar}>
              {i < trip.rating ? "★" : "☆"}
            </Text>
          ))}
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView stickyHeaderIndices={[0]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>

        <Image source={{ uri: trip.imageUrl }} style={styles.coverImage} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{trip.title}</Text>
          <View style={styles.mainInfo}>
            <Text style={styles.duration}>{trip.duration}</Text>
            <Text style={styles.type}>{trip.type}</Text>
          </View>
        </View>
        {isPast ? renderPastTripDetails() : renderUpcomingTripDetails()}
      </ScrollView>

      {!isPast && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Réserver ce voyage</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  coverImage: {
    width: "100%",
    height: 250,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  mainInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  duration: {
    fontSize: 16,
    color: "#666",
    marginRight: 12,
  },
  type: {
    fontSize: 16,
    color: "#666",
  },
  priceContainer: {
    backgroundColor: "#f8f8f8",
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f8066",
  },
  priceDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  highlightsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  highlightItem: {
    backgroundColor: "#e2f4f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  highlightText: {
    color: "#0f8066",
    fontSize: 14,
    fontWeight: "600",
  },
  dayContainer: {
    marginBottom: 16,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f8066",
    marginBottom: 4,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  dayDescription: {
    fontSize: 14,
    color: "#666",
  },
  practicalInfoContainer: {
    gap: 12,
  },
  infoItem: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
  },
  includedContainer: {
    marginTop: 16,
  },
  includedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  includedItem: {
    marginBottom: 4,
  },
  includedText: {
    fontSize: 14,
    color: "#666",
  },
  galleryImage: {
    width: 200,
    height: 150,
    marginRight: 8,
    borderRadius: 8,
  },
  memoryItem: {
    marginBottom: 12,
  },
  memoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  memoryDescription: {
    fontSize: 14,
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  ratingStar: {
    color: "#ffd700",
    fontSize: 24,
    marginRight: 4,
  },
  bottomContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  bookButton: {
    backgroundColor: "#0f8066",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
}); 