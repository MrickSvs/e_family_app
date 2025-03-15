const pool = require("../config/db");

exports.saveUser = async (req, res) => {
  try {
    const { numAdults, numChildren, childrenAges } = req.body;
    const result = await pool.query(
      "INSERT INTO users (num_adults, num_children, children_ages) VALUES ($1, $2, $3) RETURNING *",
      [numAdults, numChildren, childrenAges]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
