const express = require("express");
const pool = require("../db");
const router = express.Router();

// User books a slot
router.post("/", async (req, res) => {
  const { user_id, slot_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO bookings (user_id, slot_id, status) VALUES ($1, $2, 'pending') RETURNING *",
      [user_id, slot_id]
    );

    // mark slot unavailable
    await pool.query("UPDATE slots SET available=false WHERE id=$1", [slot_id]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error booking slot" });
  }
});

// Get user bookings
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT b.id, s.time, s.price, c.name as club_name, b.status FROM bookings b JOIN slots s ON b.slot_id=s.id JOIN clubs c ON s.club_id=c.id WHERE b.user_id=$1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching bookings" });
  }
});

module.exports = router;
