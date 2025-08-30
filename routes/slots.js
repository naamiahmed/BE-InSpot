const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get slots for a club
router.get("/:clubId", async (req, res) => {
  const { clubId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM slots WHERE club_id=$1 AND available=true", [clubId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching slots" });
  }
});

// Add slot (manager adds)
router.post("/", async (req, res) => {
  const { club_id, time, price } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO slots (club_id, time, price, available) VALUES ($1, $2, $3, true) RETURNING *",
      [club_id, time, price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error adding slot" });
  }
});

module.exports = router;
