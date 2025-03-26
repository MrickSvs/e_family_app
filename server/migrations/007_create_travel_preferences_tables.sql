-- Création de la table des catégories de tags
CREATE TABLE IF NOT EXISTS tag_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Création de la table des tags standards
CREATE TABLE IF NOT EXISTS standard_tags (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES tag_categories(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10)
);

-- Création de la table des préférences de voyage
CREATE TABLE IF NOT EXISTS travel_preferences (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(10)
);

-- Création de la table des valeurs de préférences
CREATE TABLE IF NOT EXISTS preference_values (
    id SERIAL PRIMARY KEY,
    preference_id INTEGER REFERENCES travel_preferences(id),
    value VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10)
);

-- Création de la table des préférences de voyage des familles
CREATE TABLE IF NOT EXISTS family_travel_preferences (
    id SERIAL PRIMARY KEY,
    family_id INTEGER REFERENCES families(id),
    travel_types TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table des types de voyage des itinéraires
CREATE TABLE IF NOT EXISTS itinerary_travel_types (
    id SERIAL PRIMARY KEY,
    itinerary_id INTEGER REFERENCES itineraries(id),
    travel_type_id INTEGER REFERENCES standard_tags(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création d'un trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_family_travel_preferences_updated_at
    BEFORE UPDATE ON family_travel_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 