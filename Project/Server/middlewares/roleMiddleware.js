const User = require("../models/user.model.js");

// Middleware to check if user has required role
const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId).select("-password");
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
          success: false,
          message: "Access denied. Insufficient permissions." 
        });
      }

      req.user = user; // Attach user object to request
      next();
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        message: "Error checking user role" 
      });
    }
  };
};

// Middleware to check if user is admin
const requireAdmin = requireRole("admin");

// Middleware to check if user is partner
const requirePartner = requireRole("partner");

// Middleware to check if user is regular user
const requireUser = requireRole("user");

// Middleware to check if user is partner or admin
const requirePartnerOrAdmin = requireRole("partner", "admin");

module.exports = {
  requireRole,
  requireAdmin,
  requirePartner,
  requireUser,
  requirePartnerOrAdmin,
};
