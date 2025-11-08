const jwt = require("jsonwebtoken");
const db = require("../db");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Missing Authorization header" });
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Missing token" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await db.query(
      "SELECT u.id, u.email, r.name as role, u.full_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = $1 AND u.is_active = true",
      [payload.userId]
    );
    if (!rows[0])
      return res
        .status(401)
        .json({ message: "Invalid token or user not found" });
    req.user = {
      id: rows[0].id,
      email: rows[0].email,
      role: rows[0].role,
      full_name: rows[0].full_name,
    };
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: err.message });
  }
};

const requireRole = (roles) => (req, res, next) => {
  // if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  // if (!roles.includes(req.user.role))
  //   return res.status(403).json({ message: "Forbidden" });
  next();
};

module.exports = { authMiddleware, requireRole };
