import { API_URL } from "../config";

export const saveOnboardingData = async (familyData) => {
    try {
        const response = await fetch(`${API_URL}/onboarding`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(familyData),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ Erreur d'enregistrement :", data);
            
            // Si c'est une erreur de validation, on retourne les détails des erreurs
            if (response.status === 400 && data.errors) {
                return {
                    success: false,
                    message: "Données invalides",
                    errors: data.errors.map(error => ({
                        field: error.field,
                        message: error.message
                    }))
                };
            }

            // Pour les autres types d'erreurs
            return {
                success: false,
                message: data.message || "Une erreur est survenue lors de l'enregistrement"
            };
        }

        console.log("✅ Onboarding enregistré :", data);
        return {
            success: true,
            message: "Onboarding enregistré avec succès",
            data: data.data
        };
    } catch (error) {
        console.error("❌ Erreur API :", error);
        return {
            success: false,
            message: "Erreur de connexion au serveur"
        };
    }
};
