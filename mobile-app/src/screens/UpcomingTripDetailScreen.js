import React, { useState, useEffect } from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  TextInput,
  StyleSheet,
  Dimensions,
  Linking,
  Alert,
  Modal,
  Platform
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // ou autre lib d'icônes
import AgencyBlock from "../components/AgencyBlock";
  
// Données mockées
const MOCK_WEATHER = {
  current: {
    temp: 28,
    condition: "Ensoleillé",
    icon: "sunny"
  },
  forecast: [
    { day: "Lundi", temp: 28, condition: "sunny" },
    { day: "Mardi", temp: 27, condition: "partly-sunny" },
    { day: "Mercredi", temp: 29, condition: "sunny" },
    { day: "Jeudi", temp: 26, condition: "rainy" },
    { day: "Vendredi", temp: 25, condition: "partly-sunny" }
  ]
};

const MOCK_PRACTICAL_INFO = {
  timeZone: "UTC-6",
  currency: "USD",
  electricity: "110V - Prises américaines",
  language: "Espagnol",
  emergencyNumbers: {
    police: "911",
    ambulance: "911",
    embassy: "+506 2519 2000"
  },
  healthInfo: {
    vaccins: ["Fièvre jaune recommandé", "DTP à jour", "Hépatite A conseillé"],
    hospitals: ["Clinica Biblica, San José", "Hospital CIMA, Escazú"],
    insurance: "Numéro assistance: +33 1 23 45 67 89"
  }
};

const MOCK_ACTIVITIES = [
  {
    id: 1,
    title: "Parc National Tortuguero",
    description: "Observation des tortues et balade en bateau",
    duration: "1 journée",
    price: 85,
    rating: 4.8,
    kidFriendly: true,
    booked: false,
    imageUrl: "https://example.com/tortuguero.jpg"
  },
  {
    id: 2,
    title: "Volcan Arenal et sources chaudes",
    description: "Randonnée facile et baignade relaxante",
    duration: "1/2 journée",
    price: 65,
    rating: 4.9,
    kidFriendly: true,
    booked: true,
    imageUrl: "https://example.com/arenal.jpg"
  },
  {
    id: 3,
    title: "Plage Manuel Antonio",
    description: "Baignade et observation des singes",
    duration: "1 journée",
    price: 45,
    rating: 4.7,
    kidFriendly: true,
    booked: false,
    imageUrl: "https://example.com/manuel-antonio.jpg"
  }
];

const FAMILY_MEMBERS = ["Papa", "Maman", "Julie"];

const MOCK_ESIM_DATA = {
  available: true,
  plans: [
    {
      id: 1,
      name: "Découverte",
      data: "3 Go",
      duration: "7 jours",
      price: 19.99,
      features: ["Data 4G/5G", "Appels locaux inclus", "SMS illimités"]
    },
    {
      id: 2,
      name: "Confort",
      data: "10 Go",
      duration: "15 jours",
      price: 29.99,
      features: ["Data 4G/5G", "Appels locaux et internationaux", "SMS illimités", "Hotspot inclus"]
    },
    {
      id: 3,
      name: "Premium",
      data: "Illimité",
      duration: "30 jours",
      price: 49.99,
      features: ["Data 4G/5G illimitée", "Appels monde entier", "SMS illimités", "Hotspot illimité"]
    }
  ]
};

export default function UpcomingTripDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { trip } = route.params || {};

  console.log('UpcomingTripDetailScreen - route.params:', route.params);
  console.log('UpcomingTripDetailScreen - trip:', trip);

  // États
  const [checklist, setChecklist] = useState({
    documents: [
      { id: 1, label: "Passeports", done: true, deadline: "2024-03-01", assignedTo: "Papa" },
      { id: 2, label: "Visas", done: false, deadline: "2024-03-15", assignedTo: "Maman" },
      { id: 3, label: "ESTA", done: false, deadline: "2024-03-15", assignedTo: "Maman" }
    ],
    sante: [
      { id: 4, label: "Vaccins", done: false, deadline: "2024-02-28", assignedTo: "Tous" },
      { id: 5, label: "Assurance voyage", done: true, deadline: "2024-03-01", assignedTo: "Papa" }
    ],
    equipement: [
      { id: 6, label: "Adaptateurs électriques", done: false, deadline: "2024-03-20", assignedTo: "Papa" },
      { id: 7, label: "Appareils photos", done: false, deadline: "2024-03-20", assignedTo: "Julie" }
    ],
    preparation: [
      { id: 8, label: "Garde du chat", done: true, deadline: "2024-03-15", assignedTo: "Maman" },
      { id: 9, label: "Stop courrier", done: false, deadline: "2024-03-20", assignedTo: "Papa" }
    ]
  });

  const [documents, setDocuments] = useState([
    { 
      id: 1, 
      name: "Passeports", 
      type: "identity",
      files: ["passeport_papa.pdf", "passeport_maman.pdf", "passeport_julie.pdf"],
      expiryDate: "2025-06-15"
    },
    { 
      id: 2, 
      name: "Billets d'avion", 
      type: "transport",
      files: ["billets_aller.pdf", "billets_retour.pdf"],
      reference: "ABC123"
    },
    { 
      id: 3, 
      name: "Réservations hôtels", 
      type: "accommodation",
      files: ["hotel_arenal.pdf", "hotel_tortuguero.pdf"],
      reference: "XYZ789"
    }
  ]);

  const [baggage, setBaggage] = useState({
    papa: [
      { id: 1, item: "Passeport", packed: true },
      { id: 2, item: "Appareil photo", packed: false },
      { id: 3, item: "Adaptateurs", packed: false }
    ],
    maman: [
      { id: 1, item: "Passeport", packed: true },
      { id: 2, item: "Trousse de secours", packed: false },
      { id: 3, item: "Guide voyage", packed: true }
    ],
    julie: [
      { id: 1, item: "Passeport", packed: true },
      { id: 2, item: "Jeux", packed: false },
      { id: 3, item: "Doudou", packed: true }
    ]
  });

  const [selectedTab, setSelectedTab] = useState('preparation');
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [newTask, setNewTask] = useState({
    label: '',
    category: '',
    assignedTo: '',
    deadline: ''
  });

  // États pour la gestion des eSIM
  const [showEsimModal, setShowEsimModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [esimOrdered, setEsimOrdered] = useState(false);

  // Handlers pour la gestion des eSIM
  const handleOrderEsim = (plan) => {
    setSelectedPlan(plan);
    setShowEsimModal(true);
  };

  const confirmEsimOrder = () => {
    setEsimOrdered(true);
    setShowEsimModal(false);
    Alert.alert(
      "Commande confirmée !",
      `Votre eSIM ${selectedPlan.name} sera disponible 24h avant votre départ. Vous recevrez un email avec les instructions d'installation.`
    );
  };

  // Calcul du compte à rebours
  const calculateCountdown = () => {
    const tripDate = new Date(trip.date);
    const now = new Date();
    const difference = tripDate - now;
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return { days, hours };
  };

  const { days, hours } = calculateCountdown();

  // Calcul de la progression globale
  const calculateProgress = () => {
    let totalTasks = 0;
    let completedTasks = 0;

    Object.values(checklist).forEach(category => {
      totalTasks += category.length;
      completedTasks += category.filter(task => task.done).length;
    });

    return (completedTasks / totalTasks) * 100;
  };

  const progress = calculateProgress();

  // Handlers
  const toggleTask = (categoryId, taskId) => {
    setChecklist(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].map(task =>
        task.id === taskId ? { ...task, done: !task.done } : task
      )
    }));
  };

  const toggleBaggageItem = (person, itemId) => {
    setBaggage(prev => ({
      ...prev,
      [person]: prev[person].map(item =>
        item.id === itemId ? { ...item, packed: !item.packed } : item
      )
    }));
  };

  const addDocument = (category) => {
    // Dans une vraie app, on ouvrirait le picker de fichiers ici
    Alert.alert("Ajout de document", "Cette fonctionnalité sera disponible prochainement");
  };

  const addNewTask = (category) => {
    if (!newTask.label || !newTask.assignedTo || !newTask.deadline) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    const taskId = Math.max(...Object.values(checklist).flat().map(task => task.id)) + 1;
    
    setChecklist(prev => ({
      ...prev,
      [category]: [
        ...prev[category],
        {
          id: taskId,
          label: newTask.label,
          done: false,
          deadline: newTask.deadline,
          assignedTo: newTask.assignedTo
        }
      ]
    }));

    setNewTask({
      label: '',
      category: '',
      assignedTo: '',
      deadline: ''
    });
    setExpandedCategory(null);
  };

  if (!trip) {
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
          <Text style={styles.errorText}>Impossible de charger les détails du voyage</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { tripId, title, date, imageUrl } = trip;

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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Bannière avec compte à rebours */}
        <View style={styles.banner}>
          <Image source={{ uri: trip.imageUrl }} style={styles.bannerImage} />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>{trip.title}</Text>
            <Text style={styles.bannerDates}>{trip.date}</Text>

            {/* Compte à rebours */}
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownTitle}>Départ dans</Text>
              <View style={styles.countdownValues}>
                <View style={styles.countdownItem}>
                  <Text style={styles.countdownNumber}>{days}</Text>
                  <Text style={styles.countdownLabel}>jours</Text>
                </View>
                <Text style={styles.countdownSeparator}>:</Text>
                <View style={styles.countdownItem}>
                  <Text style={styles.countdownNumber}>{hours}</Text>
                  <Text style={styles.countdownLabel}>heures</Text>
                </View>
              </View>
            </View>

            {/* Barre de progression */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressLabel}>
              Préparation : {Math.round(progress)}% complété
            </Text>
          </View>
        </View>

        {/* Navigation par onglets */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'preparation' && styles.activeTab]}
            onPress={() => setSelectedTab('preparation')}
          >
            <Ionicons name="checkbox-outline" size={20} color={selectedTab === 'preparation' ? "#0f8066" : "#666"} />
            <Text style={[styles.tabText, selectedTab === 'preparation' && styles.activeTabText]}>Préparation</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'activites' && styles.activeTab]}
            onPress={() => setSelectedTab('activites')}
          >
            <Ionicons name="map-outline" size={20} color={selectedTab === 'activites' ? "#0f8066" : "#666"} />
            <Text style={[styles.tabText, selectedTab === 'activites' && styles.activeTabText]}>Activités</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'infos' && styles.activeTab]}
            onPress={() => setSelectedTab('infos')}
          >
            <Ionicons name="information-circle-outline" size={20} color={selectedTab === 'infos' ? "#0f8066" : "#666"} />
            <Text style={[styles.tabText, selectedTab === 'infos' && styles.activeTabText]}>Infos</Text>
          </TouchableOpacity>
        </View>

        {/* Contenu selon l'onglet sélectionné */}
        {selectedTab === 'preparation' && (
          <>
            {/* Checklist par catégorie */}
            {Object.entries(checklist).map(([category, tasks]) => (
              <View key={category} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => {
                      setExpandedCategory(expandedCategory === category ? null : category);
                      setNewTask(prev => ({ ...prev, category }));
                    }}
                  >
                    <Ionicons 
                      name={expandedCategory === category ? "remove-circle-outline" : "add-circle-outline"} 
                      size={24} 
                      color="#0f8066" 
                    />
                  </TouchableOpacity>
                </View>

                {expandedCategory === category && (
                  <View style={styles.inlineForm}>
                    <TextInput
                      style={styles.inlineInput}
                      placeholder="Nom de la tâche"
                      value={newTask.label}
                      onChangeText={(text) => setNewTask(prev => ({ ...prev, label: text }))}
                    />
                    
                    <View style={styles.assigneeContainer}>
                      {FAMILY_MEMBERS.map((member) => (
                        <TouchableOpacity
                          key={member}
                          style={[
                            styles.assigneeButton,
                            newTask.assignedTo === member && styles.assigneeButtonActive
                          ]}
                          onPress={() => setNewTask(prev => ({ ...prev, assignedTo: member }))}
                        >
                          <Text style={[
                            styles.assigneeButtonText,
                            newTask.assignedTo === member && styles.assigneeButtonTextActive
                          ]}>
                            {member}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={styles.inlineFormRow}>
                      <TextInput
                        style={[styles.inlineInput, styles.dateInput]}
                        placeholder="Date limite (YYYY-MM-DD)"
                        value={newTask.deadline}
                        onChangeText={(text) => setNewTask(prev => ({ ...prev, deadline: text }))}
                      />
                      <TouchableOpacity 
                        style={styles.addInlineButton}
                        onPress={() => addNewTask(category)}
                      >
                        <Text style={styles.addInlineButtonText}>Ajouter</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {tasks.map((task) => (
                  <TouchableOpacity 
                    key={task.id} 
                    style={styles.checkItem}
                    onPress={() => toggleTask(category, task.id)}
                  >
                    <Ionicons 
                      name={task.done ? "checkbox-outline" : "square-outline"} 
                      size={24} 
                      color={task.done ? "#0f8066" : "#999"}
                    />
                    <View style={styles.checkItemContent}>
                      <Text style={task.done ? styles.checkItemDone : styles.checkItemLabel}>
                        {task.label}
                      </Text>
                      <View style={styles.checkItemMeta}>
                        <Text style={styles.checkItemDeadline}>
                          Deadline: {task.deadline}
                        </Text>
                        <Text style={styles.checkItemAssigned}>
                          {task.assignedTo}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            {/* Section bagages */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bagages</Text>
              {Object.entries(baggage).map(([person, items]) => (
                <View key={person} style={styles.baggageSection}>
                  <Text style={styles.baggagePersonName}>
                    {person.charAt(0).toUpperCase() + person.slice(1)}
                  </Text>
                  {items.map((item) => (
                    <TouchableOpacity 
                      key={item.id}
                      style={styles.baggageItem}
                      onPress={() => toggleBaggageItem(person, item.id)}
                    >
                      <Ionicons 
                        name={item.packed ? "checkbox-outline" : "square-outline"}
                        size={20}
                        color={item.packed ? "#0f8066" : "#999"}
                      />
                      <Text style={item.packed ? styles.baggageItemPacked : styles.baggageItemLabel}>
                        {item.item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </>
        )}

        {selectedTab === 'activites' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activités prévues</Text>
            {MOCK_ACTIVITIES.map((activity) => (
              <View key={activity.id} style={styles.activityCard}>
                <Image source={{ uri: activity.imageUrl }} style={styles.activityImage} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                  <View style={styles.activityMeta}>
                    <View style={styles.activityMetaItem}>
                      <Ionicons name="time-outline" size={16} color="#666" />
                      <Text style={styles.activityMetaText}>{activity.duration}</Text>
                    </View>
                    <View style={styles.activityMetaItem}>
                      <Ionicons name="cash-outline" size={16} color="#666" />
                      <Text style={styles.activityMetaText}>{activity.price}€/pers</Text>
                    </View>
                    {activity.kidFriendly && (
                      <View style={styles.activityMetaItem}>
                        <Ionicons name="happy-outline" size={16} color="#666" />
                        <Text style={styles.activityMetaText}>Enfants OK</Text>
                      </View>
                    )}
                  </View>
                  {activity.booked ? (
                    <View style={styles.activityBooked}>
                      <Ionicons name="checkmark-circle" size={20} color="#0f8066" />
                      <Text style={styles.activityBookedText}>Réservé</Text>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.activityBookButton}>
                      <Text style={styles.activityBookButtonText}>Réserver</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'infos' && (
          <>
            {/* Météo */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Météo</Text>
              <View style={styles.weatherCurrent}>
                <Ionicons name={MOCK_WEATHER.current.icon} size={40} color="#666" />
                <Text style={styles.weatherTemp}>{MOCK_WEATHER.current.temp}°C</Text>
                <Text style={styles.weatherCondition}>{MOCK_WEATHER.current.condition}</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {MOCK_WEATHER.forecast.map((day, index) => (
                  <View key={index} style={styles.weatherDay}>
                    <Text style={styles.weatherDayName}>{day.day}</Text>
                    <Ionicons name={day.condition} size={24} color="#666" />
                    <Text style={styles.weatherDayTemp}>{day.temp}°C</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Informations pratiques */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informations pratiques</Text>
              <View style={styles.practicalInfoGrid}>
                <View style={styles.practicalInfoItem}>
                  <Ionicons name="time-outline" size={24} color="#666" />
                  <Text style={styles.practicalInfoLabel}>Fuseau horaire</Text>
                  <Text style={styles.practicalInfoValue}>{MOCK_PRACTICAL_INFO.timeZone}</Text>
                </View>
                <View style={styles.practicalInfoItem}>
                  <Ionicons name="cash-outline" size={24} color="#666" />
                  <Text style={styles.practicalInfoLabel}>Monnaie</Text>
                  <Text style={styles.practicalInfoValue}>{MOCK_PRACTICAL_INFO.currency}</Text>
                </View>
                <View style={styles.practicalInfoItem}>
                  <Ionicons name="flash-outline" size={24} color="#666" />
                  <Text style={styles.practicalInfoLabel}>Électricité</Text>
                  <Text style={styles.practicalInfoValue}>{MOCK_PRACTICAL_INFO.electricity}</Text>
                </View>
                <View style={styles.practicalInfoItem}>
                  <Ionicons name="language-outline" size={24} color="#666" />
                  <Text style={styles.practicalInfoLabel}>Langue</Text>
                  <Text style={styles.practicalInfoValue}>{MOCK_PRACTICAL_INFO.language}</Text>
                </View>
              </View>
            </View>

            {/* Santé et sécurité */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Santé & Sécurité</Text>
              <View style={styles.emergencyNumbers}>
                <Text style={styles.emergencyTitle}>Numéros d'urgence</Text>
                <TouchableOpacity 
                  style={styles.emergencyItem}
                  onPress={() => Linking.openURL(`tel:${MOCK_PRACTICAL_INFO.emergencyNumbers.police}`)}
                >
                  <Ionicons name="call-outline" size={20} color="#666" />
                  <Text style={styles.emergencyLabel}>Police</Text>
                  <Text style={styles.emergencyNumber}>{MOCK_PRACTICAL_INFO.emergencyNumbers.police}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.emergencyItem}
                  onPress={() => Linking.openURL(`tel:${MOCK_PRACTICAL_INFO.emergencyNumbers.ambulance}`)}
                >
                  <Ionicons name="medical-outline" size={20} color="#666" />
                  <Text style={styles.emergencyLabel}>Ambulance</Text>
                  <Text style={styles.emergencyNumber}>{MOCK_PRACTICAL_INFO.emergencyNumbers.ambulance}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.emergencyItem}
                  onPress={() => Linking.openURL(`tel:${MOCK_PRACTICAL_INFO.emergencyNumbers.embassy}`)}
                >
                  <Ionicons name="business-outline" size={20} color="#666" />
                  <Text style={styles.emergencyLabel}>Ambassade</Text>
                  <Text style={styles.emergencyNumber}>{MOCK_PRACTICAL_INFO.emergencyNumbers.embassy}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.healthInfo}>
                <Text style={styles.healthTitle}>Informations santé</Text>
                <View style={styles.healthSection}>
                  <Text style={styles.healthSubtitle}>Vaccins recommandés</Text>
                  {MOCK_PRACTICAL_INFO.healthInfo.vaccins.map((vaccin, index) => (
                    <Text key={index} style={styles.healthText}>• {vaccin}</Text>
                  ))}
                </View>
                <View style={styles.healthSection}>
                  <Text style={styles.healthSubtitle}>Hôpitaux à proximité</Text>
                  {MOCK_PRACTICAL_INFO.healthInfo.hospitals.map((hospital, index) => (
                    <Text key={index} style={styles.healthText}>• {hospital}</Text>
                  ))}
                </View>
                <View style={styles.healthSection}>
                  <Text style={styles.healthSubtitle}>Assurance voyage</Text>
                  <Text style={styles.healthText}>{MOCK_PRACTICAL_INFO.healthInfo.insurance}</Text>
                </View>
              </View>
            </View>

            {/* Section eSIM */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Connectivité mobile</Text>
              {!esimOrdered ? (
                <View style={styles.esimContainer}>
                  <Text style={styles.esimTitle}>eSIM disponible pour votre destination</Text>
                  <Text style={styles.esimDescription}>
                    Restez connecté pendant votre voyage avec une eSIM locale.
                  </Text>
                  {MOCK_ESIM_DATA.plans.map((plan) => (
                    <TouchableOpacity
                      key={plan.id}
                      style={styles.esimPlanCard}
                      onPress={() => handleOrderEsim(plan)}
                    >
                      <View style={styles.esimPlanHeader}>
                        <Text style={styles.esimPlanName}>{plan.name}</Text>
                        <Text style={styles.esimPlanPrice}>{plan.price}€</Text>
                      </View>
                      <View style={styles.esimPlanDetails}>
                        <View style={styles.esimPlanFeature}>
                          <Ionicons name="time-outline" size={16} color="#666" />
                          <Text style={styles.esimPlanFeatureText}>{plan.duration}</Text>
                        </View>
                        <View style={styles.esimPlanFeature}>
                          <Ionicons name="cellular-outline" size={16} color="#666" />
                          <Text style={styles.esimPlanFeatureText}>{plan.data}</Text>
                        </View>
                      </View>
                      <View style={styles.esimPlanFeatures}>
                        {plan.features.map((feature, index) => (
                          <View key={index} style={styles.esimFeatureItem}>
                            <Ionicons name="checkmark-circle-outline" size={16} color="#0f8066" />
                            <Text style={styles.esimFeatureText}>{feature}</Text>
                          </View>
                        ))}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.esimOrderedContainer}>
                  <Ionicons name="checkmark-circle" size={40} color="#0f8066" />
                  <Text style={styles.esimOrderedTitle}>eSIM commandée</Text>
                  <Text style={styles.esimOrderedDescription}>
                    Vous recevrez votre eSIM par email 24h avant votre départ
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Modal de confirmation eSIM */}
      <Modal
        visible={showEsimModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmer votre commande</Text>
            {selectedPlan && (
              <>
                <Text style={styles.modalPlanName}>{selectedPlan.name}</Text>
                <Text style={styles.modalPlanPrice}>{selectedPlan.price}€</Text>
                <Text style={styles.modalPlanDuration}>{selectedPlan.duration}</Text>
                <Text style={styles.modalPlanData}>{selectedPlan.data}</Text>
              </>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowEsimModal(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmEsimOrder}
              >
                <Text style={styles.modalButtonTextConfirm}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 16,
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
  scrollContent: {
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: '#F7F5ED',
  },
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  bannerTextContainer: {
    padding: 16,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bannerDates: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  countdownContainer: {
    marginBottom: 16,
  },
  countdownTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  countdownValues: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownItem: {
    alignItems: 'center',
  },
  countdownNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f8066',
  },
  countdownLabel: {
    fontSize: 12,
    color: '#666',
  },
  countdownSeparator: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f8066',
    marginHorizontal: 16,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0f8066',
  },
  progressLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0f8066',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#0f8066',
    fontWeight: '500',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    padding: 4,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  checkItemLabel: {
    fontSize: 16,
    color: '#333',
  },
  checkItemDone: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  checkItemMeta: {
    flexDirection: 'row',
    marginTop: 4,
  },
  checkItemDeadline: {
    fontSize: 12,
    color: '#666',
    marginRight: 12,
  },
  checkItemAssigned: {
    fontSize: 12,
    color: '#0f8066',
  },
  baggageSection: {
    marginBottom: 16,
  },
  baggagePersonName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  baggageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  baggageItemLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  baggageItemPacked: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  weatherCurrent: {
    alignItems: 'center',
    marginBottom: 24,
  },
  weatherTemp: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  weatherCondition: {
    fontSize: 16,
    color: '#666',
  },
  weatherDay: {
    alignItems: 'center',
    marginRight: 24,
  },
  weatherDayName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  weatherDayTemp: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
  },
  practicalInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  practicalInfoItem: {
    width: '50%',
    padding: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  practicalInfoLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  practicalInfoValue: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  emergencyNumbers: {
    marginBottom: 24,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  emergencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  emergencyLabel: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  emergencyNumber: {
    fontSize: 14,
    color: '#0f8066',
  },
  healthInfo: {
    marginTop: 24,
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 16,
  },
  healthSection: {
    marginBottom: 16,
  },
  healthSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  healthText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  activityContent: {
    padding: 16,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  activityMeta: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  activityMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  activityMetaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  activityBooked: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityBookedText: {
    fontSize: 14,
    color: '#0f8066',
    marginLeft: 8,
  },
  activityBookButton: {
    backgroundColor: '#0f8066',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  activityBookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  inlineForm: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  inlineInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  dateInput: {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
  },
  inlineFormRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addInlineButton: {
    backgroundColor: '#0f8066',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addInlineButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  assigneeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  assigneeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  assigneeButtonActive: {
    backgroundColor: '#0f8066',
    borderColor: '#0f8066',
  },
  assigneeButtonText: {
    color: '#666',
    fontSize: 14,
  },
  assigneeButtonTextActive: {
    color: '#fff',
  },
  esimContainer: {
    padding: 16,
  },
  esimTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  esimDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  esimPlanCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  esimPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  esimPlanName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  esimPlanPrice: {
    fontSize: 14,
    color: '#666',
  },
  esimPlanDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  esimPlanFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  esimPlanFeatureText: {
    fontSize: 14,
    color: '#666',
  },
  esimPlanFeatures: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  esimFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  esimFeatureText: {
    fontSize: 14,
    color: '#666',
  },
  esimOrderedContainer: {
    alignItems: 'center',
    padding: 16,
  },
  esimOrderedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  esimOrderedDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  modalPlanName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalPlanPrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  modalPlanDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  modalPlanData: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#0f8066',
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#ff0000',
  },
  modalButtonConfirm: {
    backgroundColor: '#0f8066',
  },
  modalButtonTextCancel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  modalButtonTextConfirm: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});