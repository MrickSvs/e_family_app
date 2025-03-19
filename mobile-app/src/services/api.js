import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Créer une instance axios avec la configuration de base
const api = axios.create({
    baseURL: 'http://192.168.1.4:5001/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Ajouter un intercepteur pour les requêtes
api.interceptors.request.use(
    async (config) => {
        try {
            // Récupérer le device_id du stockage
            const deviceId = await AsyncStorage.getItem('device_id');
            if (deviceId) {
                config.headers['device-id'] = deviceId;
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du device_id:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Ajouter un intercepteur pour les réponses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Erreur de réponse:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api; 