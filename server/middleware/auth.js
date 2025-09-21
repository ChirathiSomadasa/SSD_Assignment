// middleware/auth.js
const jwt = require("jsonwebtoken");
module.exports = {
  requireAuth: (req, res, next) => {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.current_user = payload; // { userId, email, userType }
      next();
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  },
  requireRole: (...roles) => (req, res, next) => {
    if (!req.current_user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(req.current_user.userType)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  }
};
