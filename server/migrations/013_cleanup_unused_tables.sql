-- Migration pour nettoyer les tables non utilisées
-- Date: 2024-03-27

-- Suppression des tables non utilisées
DROP TABLE IF EXISTS family_preferences CASCADE;
DROP TABLE IF EXISTS preference_values CASCADE;
DROP TABLE IF EXISTS standard_tags CASCADE;
DROP TABLE IF EXISTS tag_categories CASCADE;
DROP TABLE IF EXISTS travel_preferences CASCADE;
DROP TABLE IF EXISTS trip_participants CASCADE;
DROP TABLE IF EXISTS trips CASCADE;

-- Log de la migration
DO $$
BEGIN
    RAISE NOTICE 'Migration 013: Tables non utilisées supprimées avec succès';
END $$; 