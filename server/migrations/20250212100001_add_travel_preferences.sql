-- Ajout des nouvelles colonnes pour les préférences de voyage
ALTER TABLE family_preferences
ADD COLUMN accommodation_type VARCHAR(50),
ADD COLUMN travel_pace VARCHAR(50);

-- Mise à jour des commentaires des colonnes
COMMENT ON COLUMN family_preferences.accommodation_type IS 'Type d''hébergement préféré (ex: Hôtel, Appartement, Camping)';
COMMENT ON COLUMN family_preferences.travel_pace IS 'Rythme de voyage préféré (ex: Relaxé, Modéré, Intensif)'; 