-- Table des préférences de la famille
CREATE TABLE IF NOT EXISTS family_preferences (
    family_id INTEGER PRIMARY KEY REFERENCES families(id) ON DELETE CASCADE,
    travel_type TEXT[] DEFAULT '{}',
    budget VARCHAR(50),
    accommodation_type VARCHAR(50),
    travel_pace VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger pour family_preferences
CREATE TRIGGER update_family_preferences_updated_at
    BEFORE UPDATE ON family_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 