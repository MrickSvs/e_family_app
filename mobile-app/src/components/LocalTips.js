import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

export const LocalTips = ({ familyProfile, destination }) => {
  // Données mockées pour les conseils locaux
  const tips = {
    children: {
      title: "🧒 Pour les enfants",
      tips: [
        "Prévoir un carnet de voyage à compléter avec des dessins, stickers et anecdotes par jour.",
        "Organiser un jeu de piste autour des temples de Bangkok : \"Trouvez le plus grand Bouddha !\"",
        "Choisir un hébergement avec piscine à chaque étape pour des moments de détente après les visites."
      ]
    },
    relaxation: {
      title: "🧘 Moments de détente",
      tips: [
        "À Kanchanaburi, privilégier un lodge nature avec des hamacs ou des kayaks pour s'amuser en famille.",
        "Sur les plages, prévoir des journées libres pour du snorkeling ou construire des châteaux de sable."
      ]
    },
    dining: {
      title: "🍽️ Restauration",
      tips: [
        "Repérer des restaurants kids-friendly à Bangkok avec menus adaptés et chaises hautes.",
        "Tester des cours de cuisine thaï en famille : simple, fun, et mémorable !"
      ]
    },
    travel: {
      title: "🧭 Astuce voyage",
      tips: [
        "Prévoir un rythme cool : une activité principale le matin, détente l'après-midi.",
        "Penser à la météo : certaines activités (balade à vélo, plage) peuvent dépendre des averses."
      ]
    }
  };

  const renderTipSection = (section) => {
    const data = tips[section];
    return (
      <View key={section} style={styles.section}>
        <Text style={styles.sectionTitle}>{data.title}</Text>
        {data.tips.map((tip, index) => (
          <View key={`${section}-${index}`} style={styles.tipCard}>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>Conseils locaux pour votre famille</Text>
      <Text style={styles.subtitle}>Adaptés à votre profil familial</Text>

      {Object.keys(tips).map(section => renderTipSection(section))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  tipCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 