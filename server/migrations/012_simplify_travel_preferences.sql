-- Suppression des anciennes tables de préférences
DROP TABLE IF EXISTS family_travel_preferences;
DROP TABLE IF EXISTS preference_values;
DROP TABLE IF EXISTS travel_preferences;
DROP TABLE IF EXISTS tag_categories;
DROP TABLE IF EXISTS standard_tags;
DROP TABLE IF EXISTS itinerary_standard_tags;

-- Création de la table des types de voyage
CREATE TABLE travel_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table des préférences de voyage de la famille
CREATE TABLE family_travel_preferences (
    family_id INTEGER REFERENCES families(id) ON DELETE CASCADE,
    travel_types TEXT[] NOT NULL DEFAULT '{}',
    budget VARCHAR(50) CHECK (budget IN ('Économique', 'Modéré', 'Confort', 'Luxe')),
    accommodation_type VARCHAR(50) CHECK (accommodation_type IN ('Hôtel', 'Appartement', 'Surprise')),
    travel_pace VARCHAR(50) CHECK (travel_pace IN ('Relaxé', 'Equilibré', 'Actif')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (family_id)
);

-- Création de la table de liaison entre les itinéraires et les types de voyage
CREATE TABLE itinerary_travel_types (
    itinerary_id INTEGER REFERENCES itineraries(id) ON DELETE CASCADE,
    travel_type_id INTEGER REFERENCES travel_types(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (itinerary_id, travel_type_id)
);

-- Insertion des types de voyage
INSERT INTO travel_types (name, icon, description) VALUES
    ('Culture', '🏛️', 'Musées, histoire, patrimoine'),
    ('Nature', '🌲', 'Randonnées, parcs naturels'),
    ('Plage', '🏖️', 'Mer, sable, détente'),
    ('Sport', '⚽', 'Activités sportives'),
    ('Découverte', '🗺️', 'Exploration, aventure'),
    ('Détente', '🧘‍♀️', 'Repos, bien-être'),
    ('Aventure', '🏃‍♂️', 'Activités intenses'),
    ('Non spécifié', '❓', 'À définir plus tard')
ON CONFLICT (name) DO NOTHING;

-- Association des types de voyage aux itinéraires existants
INSERT INTO itinerary_travel_types (itinerary_id, travel_type_id)
SELECT i.id, tt.id
FROM itineraries i
CROSS JOIN travel_types tt
WHERE i.type = tt.name
ON CONFLICT DO NOTHING;

-- Mise à jour des préférences de voyage existantes
INSERT INTO family_travel_preferences (family_id, travel_types, budget, accommodation_type, travel_pace)
SELECT 
    f.id,
    ARRAY['Culture', 'Nature'], -- Valeurs par défaut
    'Modéré', -- Budget par défaut
    'Hôtel', -- Type d'hébergement par défaut
    'Equilibré' -- Rythme par défaut
FROM families f
ON CONFLICT (family_id) DO NOTHING;

-- Trigger pour la mise à jour automatique du timestamp
CREATE TRIGGER update_family_travel_preferences_updated_at
    BEFORE UPDATE ON family_travel_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 