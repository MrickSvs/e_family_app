-- Ajout de la colonne duration à la table trips
ALTER TABLE trips
ADD COLUMN duration INTEGER NOT NULL DEFAULT 0; 