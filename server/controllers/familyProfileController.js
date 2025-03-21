const pool = require('../db');

const getFamilyMemberProfile = async (req, res) => {
    try {
        const { memberId } = req.params;
        
        // Get basic member info
        const memberQuery = await pool.query(
            'SELECT * FROM family_members WHERE id = $1',
            [memberId]
        );

        if (memberQuery.rows.length === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Get dietary preferences
        const dietaryQuery = await pool.query(
            'SELECT * FROM dietary_preferences WHERE family_member_id = $1',
            [memberId]
        );

        // Get travel preferences
        const travelQuery = await pool.query(
            'SELECT * FROM travel_preferences WHERE family_member_id = $1',
            [memberId]
        );

        // Get important dates
        const datesQuery = await pool.query(
            'SELECT * FROM important_dates WHERE family_member_id = $1',
            [memberId]
        );

        const profile = {
            ...memberQuery.rows[0],
            dietary_preferences: dietaryQuery.rows[0] || null,
            travel_preferences: travelQuery.rows[0] || null,
            important_dates: datesQuery.rows
        };

        res.json(profile);
    } catch (error) {
        console.error('Error fetching family member profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateFamilyMemberProfile = async (req, res) => {
    const client = await pool.connect();
    try {
        const { memberId } = req.params;
        const {
            basic_info,
            dietary_preferences,
            travel_preferences,
            important_dates
        } = req.body;

        await client.query('BEGIN');

        // Update basic info
        if (basic_info) {
            await client.query(
                `UPDATE family_members 
                SET birth_date = $1, 
                    specific_needs = $2,
                    mobility_requirements = $3,
                    medical_needs = $4
                WHERE id = $5`,
                [
                    basic_info.birth_date,
                    basic_info.specific_needs,
                    basic_info.mobility_requirements,
                    basic_info.medical_needs,
                    memberId
                ]
            );
        }

        // Update dietary preferences
        if (dietary_preferences) {
            await client.query(
                `INSERT INTO dietary_preferences (
                    family_member_id, diet_type, allergies, restrictions
                ) VALUES ($1, $2, $3, $4)
                ON CONFLICT (family_member_id) 
                DO UPDATE SET 
                    diet_type = $2,
                    allergies = $3,
                    restrictions = $4`,
                [
                    memberId,
                    dietary_preferences.diet_type,
                    dietary_preferences.allergies,
                    dietary_preferences.restrictions
                ]
            );
        }

        // Update travel preferences
        if (travel_preferences) {
            await client.query(
                `INSERT INTO travel_preferences (
                    family_member_id, travel_types, budget_range,
                    preferred_activities, accommodation_type,
                    transport_preferences, travel_pace
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (family_member_id) 
                DO UPDATE SET 
                    travel_types = $2,
                    budget_range = $3,
                    preferred_activities = $4,
                    accommodation_type = $5,
                    transport_preferences = $6,
                    travel_pace = $7`,
                [
                    memberId,
                    travel_preferences.travel_types,
                    travel_preferences.budget_range,
                    travel_preferences.preferred_activities,
                    travel_preferences.accommodation_type,
                    travel_preferences.transport_preferences,
                    travel_preferences.travel_pace
                ]
            );
        }

        // Update important dates
        if (important_dates && important_dates.length > 0) {
            // Delete existing dates
            await client.query(
                'DELETE FROM important_dates WHERE family_member_id = $1',
                [memberId]
            );

            // Insert new dates
            const dateValues = important_dates.map(date => 
                `(${memberId}, '${date.date_type}', '${date.date}', '${date.description}')`
            ).join(',');

            await client.query(
                `INSERT INTO important_dates (
                    family_member_id, date_type, date, description
                ) VALUES ${dateValues}`
            );
        }

        await client.query('COMMIT');
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating family member profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
    }
};

module.exports = {
    getFamilyMemberProfile,
    updateFamilyMemberProfile
}; 