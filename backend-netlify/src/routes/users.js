const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const { requireRole } = require("../middleware/auth");

router.get("/", requireRole(["admin"]), async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT u.id, u.email, u.full_name, u.phone, r.name as role, u.created_at, u.is_active FROM users u JOIN roles r ON u.role_id = r.id ORDER BY u.created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/me", async (req, res) => {
  return res.json(req.user);
});

router.post("/", requireRole(["admin"]), async (req, res) => {
  const { email, full_name, phone, role } = req.body;
  if (!email || !role)
    return res.status(400).json({ message: "email and role required" });
  try {
    const r = await db.query("SELECT id FROM roles WHERE name = $1", [role]);
    if (!r.rows[0]) return res.status(400).json({ message: "Invalid role" });
    const tempPassword = Math.random().toString(36).slice(-8);
    const hash = await bcrypt.hash(tempPassword, 10);
    const insert = await db.query(
      "INSERT INTO users (email, password_hash, role_id, full_name, phone) VALUES ($1,$2,$3,$4,$5) RETURNING id, email, full_name, phone",
      [email, hash, r.rows[0].id, full_name || null, phone || null]
    );
    res.json({ user: insert.rows[0], tempPassword });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.patch("/:id", requireRole(["admin"]), async (req, res) => {
  const { id } = req.params;
  const { full_name, phone, is_active, role } = req.body;
  try {
    let roleId = null;
    if (role) {
      const r = await db.query("SELECT id FROM roles WHERE name = $1", [role]);
      if (!r.rows[0]) return res.status(400).json({ message: "Invalid role" });
      roleId = r.rows[0].id;
    }
    const fields = [];
    const params = [];
    let idx = 1;
    if (full_name !== undefined) {
      fields.push(`full_name = $${idx++}`);
      params.push(full_name);
    }
    if (phone !== undefined) {
      fields.push(`phone = $${idx++}`);
      params.push(phone);
    }
    if (is_active !== undefined) {
      fields.push(`is_active = $${idx++}`);
      params.push(is_active);
    }
    if (roleId !== null) {
      fields.push(`role_id = $${idx++}`);
      params.push(roleId);
    }
    if (fields.length === 0)
      return res.status(400).json({ message: "Nothing to update" });
    params.push(id);
    const { rows } = await db.query(
      `UPDATE users SET ${fields.join(
        ", "
      )} WHERE id = $${idx} RETURNING id, email, full_name, phone, is_active`,
      params
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
