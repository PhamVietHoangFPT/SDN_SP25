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
      requiredRole.includes(decoded.role) ? null : res.status(403).json({ message: "Forbidden" });

      req.user = decoded; // Lưu thông tin user vào request
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = checkRole;
