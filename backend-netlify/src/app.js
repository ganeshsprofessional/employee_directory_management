const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const employeesRoutes = require("./routes/employees");
const departmentsRoutes = require("./routes/departments");
const { authMiddleware } = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Auth route (no auth required)
app.use("/.netlify/functions/api/auth", authRoutes);

// Protected routes (apply auth middleware)
app.use("/.netlify/functions/api/users", authMiddleware, usersRoutes);
app.use("/.netlify/functions/api/employees", authMiddleware, employeesRoutes);
app.use(
  "/.netlify/functions/api/departments",
  authMiddleware,
  departmentsRoutes
);

// Root health
app.get("/.netlify/functions/api/", (req, res) =>
  res.json({ ok: true, service: "employee-directory-api" })
);

module.exports = app;
