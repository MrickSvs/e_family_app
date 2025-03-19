import api from './api';

export const createTrip = async (tripData) => {
    console.log('tripService.createTrip - Données envoyées:', tripData);
    try {
        console.log('tripService.createTrip - Envoi de la requête...');
        const response = await api.post('/trips', tripData);
        console.log('tripService.createTrip - Réponse reçue:', response.data);
        return response.data;
    } catch (error) {
        console.error('tripService.createTrip - Erreur:', error);
        if (error.response) {
            console.error('tripService.createTrip - Détails de l\'erreur:', error.response.data);
        }
        throw new Error(error.response?.data?.message || "Erreur lors de la création du voyage");
    }
};

export const getTrips = async () => {
    try {
        const response = await api.get('/trips');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la récupération des voyages");
    }
}; 