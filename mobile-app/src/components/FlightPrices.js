import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

export const FlightPrices = ({ destination, origin }) => {
  // Données mockées pour les prix des billets
  const priceData = {
    peak: {
      title: "Haute saison",
      period: "Juin - Août",
      price: "450€",
      description: "Période la plus touristique, prix plus élevés",
      tips: [
        "Réservez 3-4 mois à l'avance",
        "Évitez les week-ends",
        "Privilégiez les vols en semaine"
      ]
    },
    shoulder: {
      title: "Moyenne saison",
      period: "Avril - Mai, Septembre - Octobre",
      price: "350€",
      description: "Période intermédiaire, bon rapport qualité/prix",
      tips: [
        "Réservez 2-3 mois à l'avance",
        "Bonne période pour les familles",
        "Météo agréable"
      ]
    },
    low: {
      title: "Basse saison",
      period: "Novembre - Mars",
      price: "250€",
      description: "Période la moins chère, moins de touristes",
      tips: [
        "Meilleurs prix disponibles",
        "Moins de monde",
        "Vérifiez la météo"
      ]
    }
  };

  const renderPeriodCard = (period) => {
    const data = priceData[period];

    return (
      <View
        key={period}
        style={styles.periodCard}
      >
        <View style={styles.periodHeader}>
          <Text style={styles.periodTitle}>{data.title}</Text>
          <Text style={styles.periodDate}>{data.period}</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{data.price}</Text>
          <Text style={styles.priceLabel}>par personne</Text>
        </View>

        <Text style={styles.description}>{data.description}</Text>

        <View style={styles.tipsContainer}>
          {data.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.primary} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prix des billets d'avion</Text>
      <Text style={styles.subtitle}>De {origin} vers {destination}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {Object.keys(priceData).map(period => renderPeriodCard(period))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  scrollView: {
    flexGrow: 1,
  },
  periodCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  periodHeader: {
    marginBottom: 12,
  },
  periodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  periodDate: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginRight: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  tipsContainer: {
    marginTop: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
}); 