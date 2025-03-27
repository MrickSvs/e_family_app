-- Insertion de quelques itinéraires de test
INSERT INTO itineraries (title, description, duration, price, image_url, tags, points) VALUES
(
    'Découverte de la Provence',
    'Un voyage enchanteur à travers les plus beaux villages de Provence',
    7,
    1200.00,
    'https://example.com/provence.jpg',
    ARRAY['Découverte', 'Culture', 'Détente'],
    '{
        "points": [
            {"name": "Avignon", "lat": 43.9493, "lon": 4.8055, "day": 1},
            {"name": "Gordes", "lat": 43.9115, "lon": 5.2002, "day": 2},
            {"name": "Roussillon", "lat": 43.9027, "lon": 5.2929, "day": 3}
        ]
    }'::jsonb
),
(
    'Aventure dans les Alpes',
    'Une expérience sportive et nature dans les plus beaux massifs des Alpes',
    5,
    800.00,
    'https://example.com/alpes.jpg',
    ARRAY['Aventure', 'Sport', 'Nature'],
    '{
        "points": [
            {"name": "Chamonix", "lat": 45.9237, "lon": 6.8694, "day": 1},
            {"name": "Annecy", "lat": 45.8992, "lon": 6.1294, "day": 3},
            {"name": "Megève", "lat": 45.8567, "lon": 6.6174, "day": 5}
        ]
    }'::jsonb
),
(
    'Détente sur la Côte d''Azur',
    'Un séjour relaxant entre plages et villages pittoresques',
    6,
    1500.00,
    'https://example.com/cote-azur.jpg',
    ARRAY['Détente', 'Plage', 'Culture'],
    '{
        "points": [
            {"name": "Nice", "lat": 43.7102, "lon": 7.2620, "day": 1},
            {"name": "Antibes", "lat": 43.5808, "lon": 7.1283, "day": 3},
            {"name": "Saint-Tropez", "lat": 43.2727, "lon": 6.6406, "day": 5}
        ]
    }'::jsonb
); 