const express = require("express");
const router = express.Router();
const db = require("../db");
const { requireRole } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT id, name FROM departments ORDER BY name"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/", requireRole(["admin"]), async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "name required" });
  try {
    const { rows } = await db.query(
      "INSERT INTO departments (name) VALUES ($1) RETURNING id, name",
      [name]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.patch("/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "name required" });
  try {
    const { rows } = await db.query(
      "UPDATE departments SET name = $1 WHERE id = $2 RETURNING id, name",
      [name, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM departments WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
