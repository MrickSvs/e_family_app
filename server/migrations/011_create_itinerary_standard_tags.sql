-- Création de la table des tags standards
CREATE TABLE IF NOT EXISTS standard_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table de liaison entre les itinéraires et les tags standards
CREATE TABLE IF NOT EXISTS itinerary_standard_tags (
    itinerary_id INTEGER REFERENCES itineraries(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES standard_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (itinerary_id, tag_id)
);

-- Insertion des tags standards de base
INSERT INTO standard_tags (name) VALUES
    ('Culture'),
    ('Nature'),
    ('Plage'),
    ('Sport'),
    ('Découverte'),
    ('Détente'),
    ('Aventure'),
    ('Non spécifié')
ON CONFLICT (name) DO NOTHING;

-- Association des tags aux itinéraires existants
INSERT INTO itinerary_standard_tags (itinerary_id, tag_id)
SELECT i.id, st.id
FROM itineraries i
CROSS JOIN standard_tags st
WHERE 
    (i.type = 'Culture' AND st.name = 'Culture') OR
    (i.type = 'Nature' AND st.name = 'Nature') OR
    (i.type = 'Plage' AND st.name = 'Plage') OR
    (i.type = 'Sport' AND st.name = 'Sport') OR
    (i.type = 'Découverte' AND st.name = 'Découverte') OR
    (i.type = 'Détente' AND st.name = 'Détente') OR
    (i.type = 'Aventure' AND st.name = 'Aventure') OR
    (i.type = 'Non spécifié' AND st.name = 'Non spécifié')
ON CONFLICT DO NOTHING; 