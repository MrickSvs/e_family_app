-- Enhance family profiles with additional fields
ALTER TABLE family_members ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE family_members ADD COLUMN IF NOT EXISTS specific_needs TEXT;
ALTER TABLE family_members ADD COLUMN IF NOT EXISTS mobility_requirements TEXT;
ALTER TABLE family_members ADD COLUMN IF NOT EXISTS medical_needs TEXT;

-- Create table for dietary preferences
CREATE TABLE IF NOT EXISTS dietary_preferences (
    id SERIAL PRIMARY KEY,
    family_member_id INTEGER REFERENCES family_members(id),
    diet_type VARCHAR(50),
    allergies TEXT[],
    restrictions TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for travel preferences
CREATE TABLE IF NOT EXISTS travel_preferences (
    id SERIAL PRIMARY KEY,
    family_member_id INTEGER REFERENCES family_members(id),
    travel_types TEXT[],
    budget_range VARCHAR(50),
    preferred_activities TEXT[],
    accommodation_type TEXT[],
    transport_preferences TEXT[],
    travel_pace VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for important dates
CREATE TABLE IF NOT EXISTS important_dates (
    id SERIAL PRIMARY KEY,
    family_member_id INTEGER REFERENCES family_members(id),
    date_type VARCHAR(50),
    date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add triggers to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_dietary_preferences_updated_at
    BEFORE UPDATE ON dietary_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_travel_preferences_updated_at
    BEFORE UPDATE ON travel_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_important_dates_updated_at
    BEFORE UPDATE ON important_dates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 