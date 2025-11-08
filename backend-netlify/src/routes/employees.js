const express = require("express");
const router = express.Router();
const db = require("../db");
const { requireRole } = require("../middleware/auth");

router.get("/", async (req, res) => {
  const {
    q,
    department,
    min_age,
    max_age,
    sort_by = "full_name",
    order = "asc",
  } = req.query;
  let base = `SELECT e.*, d.name as department_name, DATE_PART('year', AGE(e.date_of_birth))::int as age FROM employees e LEFT JOIN departments d ON e.department_id = d.id`;
  const where = [];
  const params = [];
  if (q) {
    params.push(`%${q}%`);
    where.push(
      `(e.full_name ILIKE $${params.length} OR e.email ILIKE $${params.length} OR e.designation ILIKE $${params.length})`
    );
  }
  if (department) {
    params.push(department);
    where.push(`d.name = $${params.length}`);
  }
  if (min_age) {
    params.push(min_age);
    where.push(`DATE_PART('year', AGE(e.date_of_birth)) >= $${params.length}`);
  }
  if (max_age) {
    params.push(max_age);
    where.push(`DATE_PART('year', AGE(e.date_of_birth)) <= $${params.length}`);
  }
  const whereSQL = where.length ? ` WHERE ` + where.join(" AND ") : "";
  const allowedSort = [
    "full_name",
    "age",
    "department_name",
    "date_of_joining",
  ];
  const sortCol = allowedSort.includes(sort_by) ? sort_by : "full_name";
  const orderSQL = order.toLowerCase() === "desc" ? "DESC" : "ASC";
  const final = `${base} ${whereSQL} ORDER BY ${sortCol} ${orderSQL}`;
  try {
    const { rows } = await db.query(final, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(
      "SELECT e.*, d.name as department_name FROM employees e LEFT JOIN departments d ON e.department_id = d.id WHERE e.id = $1",
      [id]
    );
    if (!rows[0]) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/", requireRole(["hr", "admin"]), async (req, res) => {
  const p = req.body;
  const cols = [
    "first_name",
    "last_name",
    "full_name",
    "email",
    "phone",
    "department_id",
    "designation",
    "date_of_birth",
    "date_of_joining",
    "gender",
    "address",
    "notes",
    "created_by",
  ];
  const vals = [
    p.first_name,
    p.last_name,
    `${p.first_name} ${p.last_name}`,
    p.email,
    p.phone,
    p.department_id || null,
    p.designation,
    p.date_of_birth || null,
    p.date_of_joining || null,
    p.gender || null,
    p.address || null,
    p.notes || null,
    req.user.id,
  ];
  const placeholders = vals.map((_, i) => `$${i + 1}`).join(",");
  try {
    const { rows } = await db.query(
      `INSERT INTO employees (${cols.join(
        ","
      )}) VALUES (${placeholders}) RETURNING *`,
      vals
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.patch("/:id", requireRole(["hr", "admin"]), async (req, res) => {
  const { id } = req.params;
  const p = req.body;
  const fields = [];
  const params = [];
  let idx = 1;
  for (const k of [
    "first_name",
    "last_name",
    "email",
    "phone",
    "department_id",
    "designation",
    "date_of_birth",
    "date_of_joining",
    "gender",
    "address",
    "notes",
  ]) {
    if (p[k] !== undefined) {
      fields.push(`${k} = $${idx}`);
      params.push(p[k]);
      idx++;
    }
  }
  if (fields.length === 0)
    return res.status(400).json({ message: "Nothing to update" });
  params.push(id);
  const sql = `UPDATE employees SET ${fields.join(
    ", "
  )} WHERE id = $${idx} RETURNING *`;
  try {
    const { rows } = await db.query(sql, params);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/:id", requireRole(["hr", "admin"]), async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM employees WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
