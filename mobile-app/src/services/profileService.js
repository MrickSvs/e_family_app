import axios from 'axios';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getDeviceId = async () => {
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

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    return data.data;
  } catch (error) {
    console.error('Error in getProfile:', error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    console.log('📤 [updateProfile] Données reçues:', profileData);
    
    const deviceId = await getDeviceId();
    console.log('🔑 [updateProfile] Device ID:', deviceId);
    
    // Validation des valeurs
    const validAccommodationTypes = ['Hôtel', 'Appartement', 'Surprise'];
    const validTravelPaces = ['Relaxé', 'Equilibré', 'Actif'];
    
    // S'assurer que le type d'hébergement est valide
    const accommodationType = validAccommodationTypes.includes(profileData.travel_preferences?.accommodation_type)
      ? profileData.travel_preferences.accommodation_type
      : 'Hôtel';
    
    // S'assurer que le rythme de voyage est valide
    const travelPace = validTravelPaces.includes(profileData.travel_preferences?.travel_pace)
      ? profileData.travel_preferences.travel_pace
      : 'Relaxé';
    
    // Préparer les données dans le format attendu par le backend
    const formattedData = {
      family_name: profileData.family_name,
      travel_preferences: {
        travel_type: profileData.travel_preferences?.travel_type || [],
        budget: profileData.travel_preferences?.budget || 'Économique',
        accommodation_type: accommodationType,
        travel_pace: travelPace
      }
    };

    console.log('📦 [updateProfile] Données formatées:', formattedData);
    console.log('🌐 [updateProfile] URL:', `${API_URL}/families/by-device/${deviceId}`);

    const response = await fetch(`${API_URL}/families/by-device/${deviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    const data = await response.json();
    console.log('📥 [updateProfile] Réponse du serveur:', {
      status: response.status,
      ok: response.ok,
      data: data
    });

    if (!response.ok) {
      console.error('❌ [updateProfile] Erreur backend:', data);
      if (response.status === 400 && data.errors) {
        console.error('❌ [updateProfile] Erreurs de validation:', data.errors);
      }
      throw new Error(data.message || 'Failed to update profile');
    }

    // Récupérer le profil complet après la mise à jour
    const getResponse = await fetch(`${API_URL}/families/by-device/${deviceId}`);
    const getData = await getResponse.json();

    if (!getResponse.ok) {
      console.error('❌ [updateProfile] Erreur lors de la récupération du profil:', getData);
      throw new Error(getData.message || 'Failed to fetch updated profile');
    }

    // Retourner les données dans le format attendu par le frontend
    return {
      family_name: getData.data.family_name,
      members: getData.data.members || [],
      travel_preferences: {
        travel_type: getData.data.travel_preferences.travel_type || [],
        budget: getData.data.travel_preferences.budget || 'Économique',
        accommodation_type: getData.data.travel_preferences.accommodation_type || 'Hôtel',
        travel_pace: getData.data.travel_preferences.travel_pace || 'Relaxé'
      }
    };
  } catch (error) {
    console.error('❌ [updateProfile] Erreur:', error);
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
    const url = `${API_URL}/families/by-device/${deviceId}/members/${memberId}`;
    
    // Ne garder que les champs nécessaires et formater la date
    const cleanedData = {
      first_name: memberData.first_name,
      last_name: memberData.last_name || undefined, // undefined sera ignoré par COALESCE dans le backend
      role: memberData.role,
      birth_date: memberData.birth_date ? memberData.birth_date.toISOString().split('T')[0] : undefined
    };

    console.log('🔍 [updateMemberProfile] Debugging info:', {
      url,
      deviceId,
      memberData: cleanedData
    });

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-device-id': deviceId
      },
      body: JSON.stringify(cleanedData),
    });

    console.log('📥 [updateMemberProfile] Response status:', response.status);
    console.log('📥 [updateMemberProfile] Response headers:', response.headers);

    // Récupérer le texte brut de la réponse d'abord
    const responseText = await response.text();
    console.log('📥 [updateMemberProfile] Raw response:', responseText);

    // Essayer de parser le JSON seulement si c'est du JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ [updateMemberProfile] JSON parse error:', parseError);
      console.error('❌ [updateMemberProfile] Response was:', responseText);
      throw new Error(`Server response was not JSON: ${responseText.substring(0, 100)}...`);
    }

    if (!response.ok) {
      console.error("❌ [updateMemberProfile] Error response:", data);
      throw new Error(data.message || 'Failed to update member profile');
    }

    return data.data;
  } catch (error) {
    console.error('❌ [updateMemberProfile] Error:', error);
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