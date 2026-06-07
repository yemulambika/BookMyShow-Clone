const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const isAuth = async (req, res, next) => {
  const token = req.cookies.jwtToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    // Load the user once and attach it so downstream middleware (roleMiddleware)
    // does not need a second DB round-trip.
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found",
      });
    }
    req.user = user;

    next();
  } catch (error) {
    const expired = error.name === "TokenExpiredError";
    return res.status(401).json({
      success: false,
      expired,
      message: expired
        ? "Access token expired"
        : "Not authorized, token validation failed",
    });
  }
};

module.exports = isAuth;
