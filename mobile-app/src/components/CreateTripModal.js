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
    Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { createTrip } from '../services/tripService';
import { theme } from '../styles/theme';

const { width, height } = Dimensions.get('window');
const MODAL_HEIGHT = height * 0.95;

export default function CreateTripModal({ visible, onClose, itinerary, familyMembers }) {
    const [estimatedDate, setEstimatedDate] = useState(new Date());
    const [notes, setNotes] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [duration, setDuration] = useState(itinerary?.duration || 0);

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
        // Ne permettre que les nombres
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
                            <Text style={styles.headerTitle}>Créer un voyage</Text>
                            <Text style={styles.headerSubtitle}>{itinerary?.title}</Text>
                        </View>
                    </View>

                    <ScrollView style={styles.scrollContent}>
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
                                numberOfLines={3}
                                placeholder="Ajoutez des précisions sur votre voyage..."
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
    scrollContent: {
        padding: 16,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
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
        minHeight: 100,
        fontSize: 16,
        color: '#333',
        textAlignVertical: 'top',
    },
    participantsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    participantCard: {
        width: (width - 48) / 2,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    participantCardSelected: {
        backgroundColor: theme.colors.primary,
    },
    participantIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    participantIconSelected: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    participantName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    participantNameSelected: {
        color: '#fff',
    },
    participantRole: {
        fontSize: 13,
        color: '#666',
    },
    participantRoleSelected: {
        color: 'rgba(255, 255, 255, 0.8)',
    },
    actionButtons: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#ff3b30',
        marginRight: 8,
    },
    createButton: {
        backgroundColor: theme.colors.primary,
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
}); 