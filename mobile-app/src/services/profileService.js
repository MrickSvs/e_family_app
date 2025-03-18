import axios from 'axios';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getDeviceId = async () => {
  let deviceId = await AsyncStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = Math.random().toString(36).substring(7);
    await AsyncStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

export const getProfile = async () => {
  try {
    const deviceId = await getDeviceId();
    const response = await axios.get(`${API_URL}/families`, {
      headers: {
        'x-device-id': deviceId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    throw error;
  }
};

export const updateFamilyProfile = async (profileData) => {
  try {
    const deviceId = await getDeviceId();
    const response = await axios.put(`${API_URL}/families`, profileData, {
      headers: {
        'x-device-id': deviceId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    throw error;
  }
};

export const updateMemberProfile = async (memberId, memberData) => {
  try {
    const deviceId = await getDeviceId();
    const response = await axios.put(`${API_URL}/families/members/${memberId}`, memberData, {
      headers: {
        'x-device-id': deviceId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du membre:', error);
    throw error;
  }
};

export const addFamilyMember = async (memberData) => {
  try {
    const deviceId = await getDeviceId();
    const response = await axios.post(`${API_URL}/families/members`, memberData, {
      headers: {
        'x-device-id': deviceId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du membre:', error);
    throw error;
  }
};

export const deleteFamilyMember = async (memberId) => {
  try {
    const deviceId = await getDeviceId();
    const response = await axios.delete(`${API_URL}/families/members/${memberId}`, {
      headers: {
        'x-device-id': deviceId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du membre:', error);
    throw error;
  }
}; 