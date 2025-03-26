import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getItineraries } from '../services/itineraryService';
import { theme } from '../styles/theme';

export default function ItineraryListScreen() {
    const navigation = useNavigation();
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchItineraries = async () => {
        try {
            const data = await getItineraries();
            setItineraries(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des itinéraires:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchItineraries();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchItineraries();
    };

    const renderItineraryCard = (itinerary) => (
        <TouchableOpacity
            key={itinerary.id}
            style={styles.itineraryCard}
            onPress={() => navigation.navigate('ItineraryDetail', { itinerary })}
        >
            <Image
                source={{ uri: itinerary.image_url }}
                style={styles.itineraryImage}
            />
            <View style={styles.itineraryContent}>
                <Text style={styles.itineraryTitle}>{itinerary.title}</Text>
                <Text style={styles.itineraryDescription} numberOfLines={2}>
                    {itinerary.description}
                </Text>
                <View style={styles.itineraryDetails}>
                    <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
                        <Text style={styles.detailText}>{itinerary.duration} jours</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="cash-outline" size={16} color={theme.colors.primary} />
                        <Text style={styles.detailText}>{itinerary.price}€</Text>
                    </View>
                </View>
                <View style={styles.tagsContainer}>
                    {itinerary.tags.slice(0, 3).map((tag, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Chargement des itinéraires...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Itinéraires recommandés</Text>
                <Text style={styles.subtitle}>
                    Découvrez des voyages adaptés à vos préférences
                </Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {itineraries.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="compass-outline" size={48} color={theme.colors.primary} />
                        <Text style={styles.emptyText}>
                            Aucun itinéraire ne correspond à vos préférences pour le moment
                        </Text>
                    </View>
                ) : (
                    itineraries.map(renderItineraryCard)
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: theme.colors.primary,
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    scrollView: {
        flex: 1,
    },
    itineraryCard: {
        margin: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    itineraryImage: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    itineraryContent: {
        padding: 16,
    },
    itineraryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    itineraryDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    itineraryDetails: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    detailText: {
        marginLeft: 4,
        fontSize: 14,
        color: theme.colors.primary,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        backgroundColor: '#e2f4f0',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
    },
    tagText: {
        fontSize: 12,
        color: theme.colors.primary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
}); 