-- Table des catégories de tags
CREATE TABLE tag_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des tags standards
CREATE TABLE standard_tags (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES tag_categories(id),
    name VARCHAR(50) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name)
);

-- Table des préférences de voyage
CREATE TABLE travel_preferences (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des valeurs possibles pour chaque préférence
CREATE TABLE preference_values (
    id SERIAL PRIMARY KEY,
    preference_id INTEGER REFERENCES travel_preferences(id),
    value VARCHAR(50) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(preference_id, value)
);

-- Table de liaison entre les itinéraires et les tags standards
CREATE TABLE itinerary_standard_tags (
    itinerary_id INTEGER REFERENCES itineraries(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES standard_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (itinerary_id, tag_id)
);

-- Table de liaison entre les itinéraires et les tags personnalisés
CREATE TABLE itinerary_custom_tags (
    id SERIAL PRIMARY KEY,
    itinerary_id INTEGER REFERENCES itineraries(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table de liaison entre les familles et leurs préférences de voyage
CREATE TABLE family_travel_preferences (
    family_id INTEGER REFERENCES families(id) ON DELETE CASCADE,
    preference_id INTEGER REFERENCES travel_preferences(id),
    value_id INTEGER REFERENCES preference_values(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (family_id, preference_id)
);

-- Triggers pour la mise à jour automatique des timestamps
CREATE TRIGGER update_tag_categories_updated_at
    BEFORE UPDATE ON tag_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_standard_tags_updated_at
    BEFORE UPDATE ON standard_tags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_travel_preferences_updated_at
    BEFORE UPDATE ON travel_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preference_values_updated_at
    BEFORE UPDATE ON preference_values
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itinerary_custom_tags_updated_at
    BEFORE UPDATE ON itinerary_custom_tags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_travel_preferences_updated_at
    BEFORE UPDATE ON family_travel_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertion des catégories de tags standards
INSERT INTO tag_categories (name, description) VALUES
('Type de voyage', 'Catégorisation principale du voyage'),
('Activités', 'Types d''activités disponibles'),
('Confort', 'Niveau de confort et commodités'),
('Accessibilité', 'Critères d''accessibilité'),
('Saison', 'Meilleure période pour le voyage');

-- Insertion des tags standards
INSERT INTO standard_tags (category_id, name, description, icon) VALUES
-- Type de voyage
(1, 'Culture', 'Voyage culturel et patrimonial', '🏛️'),
(1, 'Nature', 'Voyage nature et découverte', '🌲'),
(1, 'Plage', 'Voyage balnéaire', '🏖️'),
(1, 'Aventure', 'Voyage aventureux', '🏃‍♂️'),
(1, 'Détente', 'Voyage de détente', '🧘‍♀️'),
-- Activités
(2, 'Randonnée', 'Possibilité de randonnées', '🥾'),
(2, 'Plongée', 'Sites de plongée', '🤿'),
(2, 'Safari', 'Observation de la faune', '🦁'),
(2, 'Gastronomie', 'Découverte culinaire', '🍽️'),
-- Confort
(3, 'Luxe', 'Hébergement luxueux', '⭐'),
(3, 'Confort', 'Hébergement confortable', '🏨'),
(3, 'Économique', 'Hébergement économique', '💰'),
-- Accessibilité
(4, 'Famille', 'Adapté aux familles', '👨‍👩‍👧‍👦'),
(4, 'Handicap', 'Accessible aux personnes handicapées', '♿'),
(4, 'Senior', 'Adapté aux seniors', '👴'),
-- Saison
(5, 'Été', 'Idéal en été', '☀️'),
(5, 'Hiver', 'Idéal en hiver', '❄️'),
(5, 'Printemps', 'Idéal au printemps', '🌸'),
(5, 'Automne', 'Idéal en automne', '🍂');

-- Insertion des préférences de voyage
INSERT INTO travel_preferences (name, description, category, icon) VALUES
('Type de voyage', 'Type de voyage préféré', 'Voyage', '✈️'),
('Budget', 'Budget préféré', 'Budget', '💰'),
('Rythme', 'Rythme de voyage préféré', 'Style', '⏱️'),
('Hébergement', 'Type d''hébergement préféré', 'Confort', '🏨'),
('Transport', 'Mode de transport préféré', 'Transport', '🚗'),
('Repas', 'Préférences alimentaires', 'Alimentation', '🍽️');

-- Insertion des valeurs possibles pour les préférences
INSERT INTO preference_values (preference_id, value, description, icon) VALUES
-- Type de voyage
(1, 'Culture', 'Voyage culturel et patrimonial', '🏛️'),
(1, 'Nature', 'Voyage nature et découverte', '🌲'),
(1, 'Plage', 'Voyage balnéaire', '🏖️'),
(1, 'Aventure', 'Voyage aventureux', '🏃‍♂️'),
(1, 'Détente', 'Voyage de détente', '🧘‍♀️'),
-- Budget
(2, 'Économique', 'Budget limité', '💰'),
(2, 'Modéré', 'Budget moyen', '💵'),
(2, 'Confort', 'Budget confortable', '💸'),
(2, 'Luxe', 'Budget luxueux', '💎'),
-- Rythme
(3, 'Relaxé', 'Rythme détendu', '🐌'),
(3, 'Modéré', 'Rythme équilibré', '🚶'),
(3, 'Intensif', 'Rythme soutenu', '🏃'),
-- Hébergement
(4, 'Hôtel', 'Hôtel classique', '🏨'),
(4, 'Appartement', 'Location d''appartement', '🏠'),
(4, 'Camping', 'Camping ou bivouac', '⛺'),
(4, 'Surprise', 'Hébergement surprise', '🎁'),
-- Transport
(5, 'Avion', 'Transport aérien', '✈️'),
(5, 'Train', 'Transport ferroviaire', '🚂'),
(5, 'Voiture', 'Transport routier', '🚗'),
(5, 'Bateau', 'Transport maritime', '🚢'),
-- Repas
(6, 'Standard', 'Repas standard', '🍽️'),
(6, 'Végétarien', 'Repas végétarien', '🥬'),
(6, 'Végétalien', 'Repas végétalien', '🥗'),
(6, 'Sans gluten', 'Repas sans gluten', '🌾'); 