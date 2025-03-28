import React, { useState, useEffect } from 'react';
import {
    View,
    Modal,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView,
    Alert,
    Platform,
    Dimensions,
    Image,
    Animated,
    PanResponder,
    Vibration,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { createTrip } from '../services/tripService';
import { theme } from '../styles/theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const MODAL_HEIGHT = height * 0.9;

export default function CreateTripModal({ visible, onClose, itinerary, familyMembers }) {
    const [estimatedDate, setEstimatedDate] = useState(new Date());
    const [notes, setNotes] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [duration, setDuration] = useState(itinerary?.duration || 0);
    const slideAnimation = new Animated.Value(0);
    const [isSliding, setIsSliding] = useState(false);
    const pulseAnim = new Animated.Value(1);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            setIsSliding(true);
            Vibration.vibrate(10);
        },
        onPanResponderMove: (_, gestureState) => {
            const { dx } = gestureState;
            if (dx >= 0 && dx <= 250) {
                slideAnimation.setValue(dx);
                if (dx > 0 && dx % 50 === 0) {
                    Vibration.vibrate(5);
                }
            }
        },
        onPanResponderRelease: (_, gestureState) => {
            const { dx } = gestureState;
            setIsSliding(false);
            
            if (dx >= 200) {
                Vibration.vibrate([0, 30, 10, 30]);
                Animated.timing(slideAnimation, {
                    toValue: 250,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => {
                    handleCreateTrip();
                });
            } else {
                Animated.spring(slideAnimation, {
                    toValue: 0,
                    tension: 40,
                    friction: 7,
                    useNativeDriver: true,
                }).start();
            }
        },
    });

    const handleCreateTrip = async () => {
        if (selectedMembers.length === 0) {
            Alert.alert('Attention', 'Veuillez sélectionner au moins un participant');
            return;
        }

        if (!duration || duration < 1) {
            Alert.alert('Attention', 'Veuillez spécifier une durée valide');
            return;
        }

        try {
            setLoading(true);
            const tripData = {
                itinerary_id: itinerary.id,
                estimated_date: estimatedDate.toISOString().split('T')[0],
                notes: notes.trim(),
                participants: selectedMembers.map(m => m.id),
                duration: parseInt(duration)
            };
            
            const response = await createTrip(tripData);
            Alert.alert('Succès', 'Votre voyage a été créé avec succès !');
            onClose();
        } catch (error) {
            Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la création du voyage');
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setEstimatedDate(selectedDate);
        }
    };

    const handleDurationChange = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        if (numericValue === '' || parseInt(numericValue) > 0) {
            setDuration(numericValue);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                        <View style={styles.headerContent}>
                            <Text style={styles.headerTitle}>Préparez votre aventure</Text>
                            <Text style={styles.headerSubtitle}>{itinerary?.title}</Text>
                        </View>
                    </View>

                    {/* Section Agence - Sticky */}
                    <View style={styles.agencySection}>
                        <View style={styles.agencyCard}>
                            <Image 
                                source={{ uri: "https://static1.evcdn.net/images/reduction/1649071_w-768_h-1024_q-70_m-crop.jpg" }}
                                style={styles.agencyImage}
                            />
                            <View style={styles.agencyInfo}>
                                <View style={styles.agencyHeader}>
                                    <Text style={styles.agencyName}>L'agence de Virginie</Text>
                                    <View style={styles.agencyRating}>
                                        <Ionicons name="star" size={14} color="#FFD700" />
                                        <Text style={styles.agencyRatingText}>4.5</Text>
                                    </View>
                                </View>
                                <Text style={styles.agencyExpertise}>Expert voyage en famille • 3 ans d'exp.</Text>
                            </View>
                        </View>
                    </View>

                    <ScrollView style={styles.scrollContent}>
                        <View style={styles.contentContainer}>
                            {/* Section Date */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
                                    <Text style={styles.sectionTitle}>Date estimée du voyage</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.datePickerButton}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text style={styles.datePickerButtonText}>
                                        {estimatedDate.toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </Text>
                                </TouchableOpacity>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={estimatedDate}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={handleDateChange}
                                        minimumDate={new Date()}
                                    />
                                )}
                            </View>

                            {/* Section Durée */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
                                    <Text style={styles.sectionTitle}>Durée du voyage</Text>
                                </View>
                                <View style={styles.durationContainer}>
                                    <TextInput
                                        style={styles.durationInput}
                                        keyboardType="numeric"
                                        value={duration.toString()}
                                        onChangeText={handleDurationChange}
                                        placeholder="Nombre de jours"
                                        placeholderTextColor="#999"
                                        maxLength={3}
                                    />
                                    <Text style={styles.durationUnit}>jours</Text>
                                </View>
                            </View>

                            {/* Section Notes */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="pencil-outline" size={24} color={theme.colors.primary} />
                                    <Text style={styles.sectionTitle}>Notes supplémentaires</Text>
                                </View>
                                <TextInput
                                    style={styles.notesInput}
                                    multiline
                                    numberOfLines={2}
                                    placeholder="Parlez-nous de votre voyage de rêve ! Vos envies d'activités, vos préférences d'hébergement, les besoins des enfants..."
                                    placeholderTextColor="#999"
                                    value={notes}
                                    onChangeText={setNotes}
                                />
                            </View>

                            {/* Section Participants */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="people-outline" size={24} color={theme.colors.primary} />
                                    <Text style={styles.sectionTitle}>Participants</Text>
                                </View>
                                <Text style={styles.sectionSubtitle}>
                                    Sélectionnez les membres qui participeront au voyage
                                </Text>
                                <View style={styles.participantsGrid}>
                                    {familyMembers.map((member) => (
                                        <TouchableOpacity
                                            key={member.id}
                                            style={[
                                                styles.participantCard,
                                                selectedMembers.some(m => m.id === member.id) && styles.participantCardSelected
                                            ]}
                                            onPress={() => {
                                                setSelectedMembers(prev =>
                                                    prev.some(m => m.id === member.id)
                                                        ? prev.filter(m => m.id !== member.id)
                                                        : [...prev, member]
                                                );
                                            }}
                                        >
                                            <View style={[
                                                styles.participantIcon,
                                                selectedMembers.some(m => m.id === member.id) && styles.participantIconSelected
                                            ]}>
                                                <Ionicons
                                                    name={member.role === 'Adulte' ? 'person' : 'body-outline'}
                                                    size={24}
                                                    color={selectedMembers.some(m => m.id === member.id) ? '#fff' : theme.colors.primary}
                                                />
                                            </View>
                                            <Text style={[
                                                styles.participantName,
                                                selectedMembers.some(m => m.id === member.id) && styles.participantNameSelected
                                            ]}>
                                                {member.first_name}
                                            </Text>
                                            <Text style={[
                                                styles.participantRole,
                                                selectedMembers.some(m => m.id === member.id) && styles.participantRoleSelected
                                            ]}>
                                                {member.role}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Bouton d'action */}
                    <View style={styles.actionButtons}>
                        <View style={styles.sliderContainer}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.sliderGradient}
                            />
                            <Animated.View
                                style={[
                                    styles.sliderButton,
                                    {
                                        transform: [
                                            { translateX: slideAnimation },
                                            { scale: isSliding ? 1.1 : pulseAnim }
                                        ],
                                    },
                                ]}
                                {...panResponder.panHandlers}
                            >
                                <LinearGradient
                                    colors={[theme.colors.primary, theme.colors.secondary || '#1E88E5']}
                                    style={styles.buttonGradient}
                                >
                                    <Ionicons name="airplane" size={24} color="#fff" />
                                </LinearGradient>
                            </Animated.View>
                            <Animated.Text 
                                style={[
                                    styles.sliderText,
                                    {
                                        opacity: slideAnimation.interpolate({
                                            inputRange: [0, 200],
                                            outputRange: [1, 0],
                                        })
                                    }
                                ]}
                            >
                                {loading ? 'Création...' : 'Glissez pour lancer l\'aventure →'}
                            </Animated.Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: MODAL_HEIGHT,
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
    },
    closeButton: {
        padding: 8,
        marginRight: 12,
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 100,
    },
    section: {
        marginBottom: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginLeft: 12,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    datePickerButton: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 12,
        marginTop: 4,
    },
    datePickerButtonText: {
        fontSize: 16,
        color: '#333',
    },
    notesInput: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 12,
        height: 80,
        fontSize: 16,
        color: '#333',
        textAlignVertical: 'top',
    },
    participantsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 8,
        marginTop: 4,
    },
    participantCard: {
        width: (width - 64) / 3,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 6,
        alignItems: 'center',
    },
    participantCardSelected: {
        backgroundColor: theme.colors.primary,
    },
    participantIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    },
    participantIconSelected: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    participantName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        marginBottom: 1,
        textAlign: 'center',
    },
    participantNameSelected: {
        color: '#fff',
    },
    participantRole: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
    },
    participantRoleSelected: {
        color: 'rgba(255, 255, 255, 0.8)',
    },
    actionButtons: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    sliderContainer: {
        height: 60,
        backgroundColor: '#f8f8f8',
        borderRadius: 30,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    sliderGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    buttonGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderButton: {
        position: 'absolute',
        left: 0,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: theme.colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    sliderText: {
        fontSize: 18,
        color: '#666',
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginTop: 4,
    },
    durationInput: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    durationUnit: {
        fontSize: 16,
        color: '#666',
        marginLeft: 8,
    },
    agencySection: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        padding: 12,
    },
    agencyCard: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    agencyImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    agencyInfo: {
        flex: 1,
    },
    agencyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    agencyName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    agencyRating: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    agencyRatingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginLeft: 4,
    },
    agencyExpertise: {
        fontSize: 13,
        color: '#666',
    },
    scrollContent: {
        flex: 1,
    },
}); 