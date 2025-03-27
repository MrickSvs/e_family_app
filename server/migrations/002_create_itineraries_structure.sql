-- Table des itinéraires
CREATE TABLE IF NOT EXISTS itineraries (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL,
    price DECIMAL(10,2),
    image_url TEXT,
    tags VARCHAR[] NOT NULL DEFAULT '{}',
    points JSONB NOT NULL DEFAULT '{}',
    family_recommendations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger pour la mise à jour automatique du timestamp
CREATE TRIGGER update_itineraries_updated_at
    BEFORE UPDATE ON itineraries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Index pour améliorer les performances des recherches
CREATE INDEX idx_itineraries_tags ON itineraries USING GIN(tags);
CREATE INDEX idx_itineraries_points ON itineraries USING GIN(points);

-- Table des voyages planifiés (nécessaire car référencée par l'application)
CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    family_id INTEGER REFERENCES families(id) ON DELETE CASCADE,
    itinerary_id INTEGER REFERENCES itineraries(id),
    estimated_date DATE NOT NULL,
    notes TEXT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('planifié', 'en cours', 'terminé', 'annulé')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger pour trips
CREATE TRIGGER update_trips_updated_at
    BEFORE UPDATE ON trips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Table des participants au voyage (nécessaire car référencée par l'application)
CREATE TABLE IF NOT EXISTS trip_participants (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    member_id INTEGER REFERENCES family_members(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(trip_id, member_id)
); 