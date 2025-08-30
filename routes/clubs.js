const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get all clubs
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clubs WHERE status='approved'");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching clubs" });
  }
});

// Add a club (manager request)
router.post("/", async (req, res) => {
  const { name, location, manager_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO clubs (name, location, manager_id, status) VALUES ($1, $2, $3, 'pending') RETURNING *",
      [name, location, manager_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error adding club" });
  }
});

module.exports = router;
