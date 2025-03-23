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

const createDefaultProfile = async (deviceId) => {
  try {
    const defaultProfile = {
      family_name: 'Ma Famille',
      members: []
    };
    
    const response = await axios.post(`${API_URL}/families/by-device/${deviceId}`, defaultProfile, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du profil par défaut:', error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const deviceId = await getDeviceId();

    const response = await fetch(`${API_URL}/families/by-device/${deviceId}`);
    const data = await response.json();

    console.log("Response from API:", data); // Debug log

    if (!response.ok) {
      console.error("❌ Erreur lors de la récupération du profil:", data);
      
      if (response.status === 404) {
        // Si le profil n'existe pas, on en crée un par défaut
        return await createDefaultProfile(deviceId);
      }

      throw new Error(data.message || 'Failed to fetch profile');
    }

    // Vérifier si la réponse a la structure attendue
    if (!data.success || !data.data) {
      console.error("❌ Format de réponse invalide:", data);
      throw new Error('Invalid response format');
    }

    return data.data;
  } catch (error) {
    console.error('Error in getProfile:', error);
    throw error;
  }
};

export const updateFamilyProfile = async (profileData) => {
  try {
    const deviceId = await getDeviceId();

    const response = await fetch(`${API_URL}/families/by-device/${deviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Erreur lors de la mise à jour du profil:", data);
      
      // Si c'est une erreur de validation, on retourne les détails des erreurs
      if (response.status === 400 && data.errors) {
        throw new Error(JSON.stringify({
          message: "Données invalides",
          errors: data.errors
        }));
      }

      throw new Error(data.message || 'Failed to update profile');
    }

    return data.data;
  } catch (error) {
    console.error('Error in updateFamilyProfile:', error);
    throw error;
  }
};

export const updateMemberProfile = async (memberId, memberData) => {
  try {
    const deviceId = await getDeviceId();

    const response = await fetch(`${API_URL}/families/by-device/${deviceId}/members/${memberId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Erreur lors de la mise à jour du membre:", data);
      
      // Si c'est une erreur de validation, on retourne les détails des erreurs
      if (response.status === 400 && data.errors) {
        throw new Error(JSON.stringify({
          message: "Données invalides",
          errors: data.errors
        }));
      }

      throw new Error(data.message || 'Failed to update member profile');
    }

    return data.data;
  } catch (error) {
    console.error('Error in updateMemberProfile:', error);
    throw error;
  }
};

export const addFamilyMember = async (memberData) => {
  try {
    const deviceId = await getDeviceId();

    const response = await fetch(`${API_URL}/families/by-device/${deviceId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Erreur lors de l'ajout du membre:", data);
      
      // Si c'est une erreur de validation, on retourne les détails des erreurs
      if (response.status === 400 && data.errors) {
        throw new Error(JSON.stringify({
          message: "Données invalides",
          errors: data.errors
        }));
      }

      throw new Error(data.message || 'Failed to add family member');
    }

    return data.data;
  } catch (error) {
    console.error('Error in addFamilyMember:', error);
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