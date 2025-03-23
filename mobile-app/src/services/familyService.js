import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getFamilyInfo = async () => {
    try {
        const deviceId = await AsyncStorage.getItem('deviceId');
        if (!deviceId) {
            throw new Error('Device ID not found');
        }

        const response = await fetch(`${API_URL}/families/by-device/${deviceId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch family info');
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch family info');
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching family info:', error);
        throw error;
    }
}; 