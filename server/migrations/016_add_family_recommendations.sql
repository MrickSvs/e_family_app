-- Migration pour ajouter la colonne family_recommendations à la table itineraries
-- Date: 2024-03-19
-- Description: Ajoute une colonne JSONB pour stocker les recommandations familiales pour chaque itinéraire

-- Ajout de la colonne family_recommendations
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS family_recommendations JSONB;

-- Ajout d'un commentaire sur la colonne
COMMENT ON COLUMN itineraries.family_recommendations IS 'Recommandations familiales pour l''itinéraire, incluant les conseils pour les enfants, la préparation pratique, les moments de détente et les options de restauration';

-- Log de la migration
DO $$
BEGIN
    RAISE NOTICE 'Migration 016: Colonne family_recommendations ajoutée à la table itineraries';
END $$; 