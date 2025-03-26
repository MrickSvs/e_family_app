-- Migration pour supprimer la colonne type des itinéraires
-- Date: 2024-03-27

-- Suppression de la colonne type
ALTER TABLE itineraries DROP COLUMN IF EXISTS type;

-- Log de la migration
DO $$
BEGIN
    RAISE NOTICE 'Migration 015: Colonne type supprimée de la table itineraries';
END $$; 