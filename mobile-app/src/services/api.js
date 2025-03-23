import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

export const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Intercepteur pour ajouter le device-id
api.interceptors.request.use(
    async (config) => {
        try {
            const deviceId = await AsyncStorage.getItem('deviceId');
            if (deviceId) {
                config.headers['device-id'] = deviceId;
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
            // Formater le message d'erreur
            const errorMessage = error.response.data.message || 'Une erreur est survenue';
            error.message = errorMessage;
        }
        return Promise.reject(error);
    }
); 