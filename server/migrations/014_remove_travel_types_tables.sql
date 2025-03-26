-- Migration pour supprimer les tables travel_types et itinerary_travel_types
-- Date: 2024-03-27

-- Suppression des tables
DROP TABLE IF EXISTS itinerary_travel_types CASCADE;
DROP TABLE IF EXISTS travel_types CASCADE;

-- Log de la migration
DO $$
BEGIN
    RAISE NOTICE 'Migration 014: Tables travel_types et itinerary_travel_types supprimées avec succès';
END $$; 