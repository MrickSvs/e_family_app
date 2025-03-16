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

        if (data.success) {
            console.log("✅ Onboarding enregistré :", data);
            return { success: true, message: "Onboarding enregistré avec succès" };
        } else {
            console.error("❌ Erreur d’enregistrement :", data.message);
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error("❌ Erreur API :", error);
        return { success: false, message: "Erreur de connexion au serveur" };
    }
};
