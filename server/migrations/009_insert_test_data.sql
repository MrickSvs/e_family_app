-- Insertion des catégories de tags
INSERT INTO tag_categories (name, description) VALUES
('Type de voyage', 'Catégorie des différents types de voyages'),
('Niveau d''activité', 'Intensité des activités pendant le voyage'),
('Type d''hébergement', 'Types d''hébergements disponibles'),
('Services inclus', 'Services inclus dans le voyage'),
('Accessibilité', 'Critères d''accessibilité du voyage');

-- Insertion des tags standards
INSERT INTO standard_tags (name, description, icon) VALUES
-- Type de voyage
('Nature & découverte', 'Voyage axé sur la nature et la découverte', '🌲'),
('Culture & détente', 'Voyage culturel et relaxant', '🏛️'),
('Aventure', 'Voyage avec des activités aventureuses', '🏃'),
('Plage & soleil', 'Voyage balnéaire', '🏖️'),
('Montagne', 'Voyage en montagne', '⛰️'),
('Ville', 'Voyage en ville', '🏙️'),

-- Niveau d'activité
('Très actif', 'Beaucoup d''activités physiques', '⚡'),
('Modéré', 'Activités modérées', '⚖️'),
('Relaxant', 'Peu d''activités physiques', '😌'),

-- Type d'hébergement
('Hôtel', 'Hébergement en hôtel', '🏨'),
('Camping', 'Hébergement en camping', '⛺'),
('Appartement', 'Hébergement en appartement', '🏠'),
('Refuge', 'Hébergement en refuge', '🏔️'),

-- Services inclus
('Guide local', 'Guide local inclus', '👨‍🦯'),
('Transport', 'Transport inclus', '🚗'),
('Repas', 'Repas inclus', '🍽️'),
('Activités', 'Activités incluses', '🎯'),

-- Accessibilité
('Accessible PMR', 'Accessible aux personnes à mobilité réduite', '♿'),
('Adapté aux enfants', 'Adapté aux enfants', '👶'),
('Adapté aux seniors', 'Adapté aux seniors', '👴');

-- Insertion des itinéraires
INSERT INTO itineraries (title, description, duration, type, price, image_url, tags, points) VALUES
(
    'Découverte des Alpes',
    'Un voyage inoubliable dans les Alpes avec des activités de montagne et des paysages à couper le souffle.',
    7,
    'Nature & découverte',
    1200.00,
    'https://example.com/alpes.jpg',
    ARRAY['Nature & découverte', 'Montagne', 'Très actif', 'Refuge', 'Guide local', 'Transport', 'Repas', 'Activités', 'Adapté aux enfants'],
    '[{"day": 1, "title": "Arrivée à Chamonix", "description": "Installation et acclimatation", "coordinate": {"latitude": 45.9237, "longitude": 6.8694}, "steps": [{"time": "14:00", "activity": "Arrivée à l''hôtel", "icon": "🏨"}]}]'
),
(
    'Week-end culturel à Paris',
    'Découvrez les plus beaux musées et monuments de Paris.',
    3,
    'Culture & détente',
    800.00,
    'https://example.com/paris.jpg',
    ARRAY['Culture & détente', 'Ville', 'Modéré', 'Hôtel', 'Guide local', 'Transport', 'Repas', 'Accessible PMR'],
    '[{"day": 1, "title": "Arrivée à Paris", "description": "Installation à l''hôtel", "coordinate": {"latitude": 48.8566, "longitude": 2.3522}, "steps": [{"time": "15:00", "activity": "Arrivée à l''hôtel", "icon": "🏨"}]}]'
),
(
    'Séjour balnéaire en Corse',
    'Profitez des plus belles plages de Corse avec des activités nautiques.',
    5,
    'Plage & soleil',
    1500.00,
    'https://example.com/corse.jpg',
    ARRAY['Plage & soleil', 'Relaxant', 'Hôtel', 'Transport', 'Repas', 'Activités', 'Adapté aux enfants'],
    '[{"day": 1, "title": "Arrivée à Ajaccio", "description": "Installation à l''hôtel", "coordinate": {"latitude": 41.9192, "longitude": 8.7386}, "steps": [{"time": "16:00", "activity": "Arrivée à l''hôtel", "icon": "🏨"}]}]'
);

-- Association des types de voyage aux itinéraires
INSERT INTO itinerary_travel_types (itinerary_id, travel_type_id)
SELECT i.id, s.id
FROM itineraries i
CROSS JOIN standard_tags s
WHERE s.name = ANY(i.tags);

-- Insertion des préférences de voyage pour la famille test
INSERT INTO family_travel_preferences (family_id, travel_types)
SELECT id, ARRAY['Nature & découverte', 'Culture & détente', 'Plage & soleil']
FROM families
WHERE device_id = 'test-device-id'; 