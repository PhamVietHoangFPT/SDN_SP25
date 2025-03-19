const jwt = require("jsonwebtoken");

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
      if (!requiredRole.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error("Token error:", error.message);
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};


module.exports = checkRole;
