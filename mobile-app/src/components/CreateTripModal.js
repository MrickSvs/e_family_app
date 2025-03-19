import React, { useState } from 'react';
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
    Image,
    Dimensions
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { createTrip } from '../services/tripService';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function CreateTripModal({ visible, onClose, itinerary, familyMembers }) {
    console.log('CreateTripModal - Props reçues:', {
        visible,
        itinerary: itinerary ? {
            id: itinerary.id,
            title: itinerary.title
        } : null,
        familyMembersCount: familyMembers?.length
    });

    const [estimatedDate, setEstimatedDate] = useState(new Date());
    const [notes, setNotes] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleCreateTrip = async () => {
        if (selectedMembers.length === 0) {
            Alert.alert('Attention', 'Veuillez sélectionner au moins un participant');
            return;
        }

        try {
            setLoading(true);
            console.log('Début de la création du voyage');
            const tripData = {
                itinerary_id: itinerary.id,
                estimated_date: estimatedDate.toISOString().split('T')[0],
                notes: notes.trim(),
                participants: selectedMembers.map(m => m.id)
            };
            console.log('Données du voyage à créer:', tripData);
            
            const response = await createTrip(tripData);
            console.log('Réponse de création du voyage:', response);
            
            Alert.alert('Succès', 'Votre voyage a été créé avec succès !');
            onClose();
        } catch (error) {
            console.error('Erreur lors de la création du voyage:', error);
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

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    {/* Header avec image et dégradé */}
                    <View style={styles.headerContainer}>
                        <Image 
                            source={{ uri: itinerary?.imageUrl }} 
                            style={styles.headerImage}
                        />
                        <LinearGradient
                            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']}
                            style={styles.headerGradient}
                        >
                            <TouchableOpacity 
                                style={styles.closeButton}
                                onPress={onClose}
                            >
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Créer un voyage</Text>
                            <Text style={styles.headerSubtitle}>{itinerary?.title}</Text>
                        </LinearGradient>
                    </View>

                    <ScrollView style={styles.scrollContent}>
                        {/* Section Date */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Date estimée du voyage</Text>
                            <TouchableOpacity
                                style={styles.datePickerButton}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Ionicons name="calendar-outline" size={24} color="#0f8066" />
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

                        {/* Section Notes */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Notes supplémentaires</Text>
                            <TextInput
                                style={styles.notesInput}
                                multiline
                                numberOfLines={4}
                                placeholder="Ajoutez des précisions sur votre voyage..."
                                placeholderTextColor="#999"
                                value={notes}
                                onChangeText={setNotes}
                            />
                        </View>

                        {/* Section Participants */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Participants</Text>
                            <Text style={styles.sectionSubtitle}>
                                Sélectionnez les membres qui participeront au voyage
                            </Text>
                            <View style={styles.participantsGrid}>
                                {familyMembers.map((member) => (
                                    <TouchableOpacity
                                        key={member.id}
                                        style={[
                                            styles.participantCard,
                                            selectedMembers.includes(member) && styles.participantCardSelected
                                        ]}
                                        onPress={() => {
                                            setSelectedMembers(prev =>
                                                prev.includes(member)
                                                    ? prev.filter(m => m.id !== member.id)
                                                    : [...prev, member]
                                            );
                                        }}
                                    >
                                        <View style={[
                                            styles.participantIcon,
                                            selectedMembers.includes(member) && styles.participantIconSelected
                                        ]}>
                                            <Ionicons
                                                name={member.role === 'Adulte' ? 'person' : 'body-outline'}
                                                size={24}
                                                color={selectedMembers.includes(member) ? '#fff' : '#0f8066'}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.participantName,
                                            selectedMembers.includes(member) && styles.participantNameSelected
                                        ]}>
                                            {member.first_name}
                                        </Text>
                                        <Text style={[
                                            styles.participantRole,
                                            selectedMembers.includes(member) && styles.participantRoleSelected
                                        ]}>
                                            {member.role}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Boutons d'action */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>Annuler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.createButton]}
                            onPress={handleCreateTrip}
                            disabled={loading}
                        >
                            <Text style={styles.createButtonText}>
                                {loading ? 'Création...' : 'Créer le voyage'}
                            </Text>
                        </TouchableOpacity>
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
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '90%',
    },
    headerContainer: {
        height: 200,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    headerGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 40,
    },
    headerSubtitle: {
        color: '#fff',
        fontSize: 18,
        marginTop: 8,
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
    },
    datePickerButtonText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
    },
    notesInput: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        minHeight: 120,
        fontSize: 16,
        color: '#333',
        textAlignVertical: 'top',
    },
    participantsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    participantCard: {
        width: (width - 60) / 2,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    participantCardSelected: {
        backgroundColor: '#0f8066',
    },
    participantIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    participantIconSelected: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    participantName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    participantNameSelected: {
        color: '#fff',
    },
    participantRole: {
        fontSize: 14,
        color: '#666',
    },
    participantRoleSelected: {
        color: 'rgba(255, 255, 255, 0.8)',
    },
    actionButtons: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#ff3b30',
        marginRight: 8,
    },
    createButton: {
        backgroundColor: '#0f8066',
        marginLeft: 8,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 