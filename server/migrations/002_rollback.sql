-- Suppression des tables dans l'ordre inverse de leur création (pour respecter les contraintes de clé étrangère)
DROP TABLE IF EXISTS trip_participants;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS itineraries; 