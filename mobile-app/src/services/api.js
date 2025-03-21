import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            return Promise.reject(error);
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            // Gérer les erreurs d'authentification
            if (error.response.status === 401) {
                await AsyncStorage.removeItem('authToken');
                // Rediriger vers la page de connexion si nécessaire
            }
            
            // Formater le message d'erreur
            const errorMessage = error.response.data.message || 'Une erreur est survenue';
            error.message = errorMessage;
        }
        return Promise.reject(error);
    }
); 