-- Ajout des nouveaux champs à la table family_preferences
ALTER TABLE family_preferences
ADD COLUMN IF NOT EXISTS accommodation_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS travel_pace VARCHAR(50); 