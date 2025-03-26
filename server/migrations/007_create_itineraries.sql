-- Création de la table des itinéraires
CREATE TABLE itineraries (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- durée en jours
    type VARCHAR(50) NOT NULL, -- ex: "Nature & découverte", "Culture & détente"
    price DECIMAL(10,2),
    image_url TEXT,
    tags TEXT[], -- tableau de tags pour faciliter la recherche
    points JSONB NOT NULL, -- stockage des points de l'itinéraire avec leurs coordonnées et étapes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger pour la mise à jour automatique du timestamp
CREATE TRIGGER update_itineraries_updated_at
    BEFORE UPDATE ON itineraries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Index pour améliorer les performances des recherches
CREATE INDEX idx_itineraries_type ON itineraries(type);
CREATE INDEX idx_itineraries_tags ON itineraries USING GIN(tags);
CREATE INDEX idx_itineraries_points ON itineraries USING GIN(points); 