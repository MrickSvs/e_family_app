import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDeviceId } from './profileService';

/**
 * Récupère tous les itinéraires avec filtres optionnels
 */
export const getItineraries = async (filters = {}) => {
    try {
        // Récupérer l'ID de l'appareil
        const deviceId = await getDeviceId();
        if (!deviceId) {
            throw new Error('Device ID not found');
        }

        // Construire les paramètres de requête
        const queryParams = new URLSearchParams({
            ...filters,
            device_id: deviceId // Utiliser device_id au lieu de family_id
        });

        const response = await fetch(`${API_URL}/itineraries?${queryParams}`);
        if (!response.ok) {
            throw new Error('Failed to fetch itineraries');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching itineraries:', error);
        throw error;
    }
};

/**
 * Récupère un itinéraire par son ID
 */
export const getItineraryById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/itineraries/${id}`);
        
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de l\'itinéraire');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('❌ Erreur dans getItineraryById:', error);
        throw error;
    }
};

/**
 * Crée un nouvel itinéraire
 */
export const createItinerary = async (itineraryData) => {
    try {
        const response = await fetch(`${API_URL}/itineraries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itineraryData),
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la création de l\'itinéraire');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('❌ Erreur dans createItinerary:', error);
        throw error;
    }
};

/**
 * Met à jour un itinéraire existant
 */
export const updateItinerary = async (id, itineraryData) => {
    try {
        const response = await fetch(`${API_URL}/itineraries/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itineraryData),
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour de l\'itinéraire');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('❌ Erreur dans updateItinerary:', error);
        throw error;
    }
};

/**
 * Supprime un itinéraire
 */
export const deleteItinerary = async (id) => {
    try {
        const response = await fetch(`${API_URL}/itineraries/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de l\'itinéraire');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Erreur dans deleteItinerary:', error);
        throw error;
    }
}; 