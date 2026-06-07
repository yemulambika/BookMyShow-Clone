const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const isAuth = require("../middlewares/authMiddleware.js");
const {
  setAuthCookies,
  clearAuthCookies,
  accessCookieOptions,
  signAccessToken,
  sanitizeUser,
} = require("../utils/auth.js");
const logger = require("../utils/logger.js");

const userRouter = express.Router(); // Route

// Sign up Route
userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Prevent admin registration through API
    if (req.body.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin registration is not allowed through this endpoint",
      });
    }

    // check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User Already Exists with the Email",
      });
    }

    // Set default role to 'user' if not provided or if invalid
    const allowedRoles = ["user", "partner"];
    const role = allowedRoles.includes(req.body.role) ? req.body.role : "user";

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(password, salt);

    const newUser = await User.create({ name, email, password: hashPwd, role });

    // Auto-login on successful registration so the user lands on their
    // dashboard without a second round-trip.
    setAuthCookies(res, newUser._id);

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
});

// Login Api
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist. Please Register",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Sorry, invalid password entered!",
      });
    }

    setAuthCookies(res, user._id);

    res.json({
      success: true,
      message: "You've successfully logged in!",
      user: sanitizeUser(user),
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error in Logging in!",
    });
  }
});

// Issue a fresh access token using the refresh token cookie.
userRouter.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "No refresh token provided",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    res.cookie("jwtToken", signAccessToken(decoded.userId), accessCookieOptions());
    res.json({ success: true, message: "Token refreshed" });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
});

userRouter.get("/current-user", isAuth, async (req, res) => {
  // isAuth already loaded the user and stripped the password.
  res.json(sanitizeUser(req.user));
});

// Logout route
userRouter.post("/logout", async (req, res) => {
  try {
    clearAuthCookies(res);
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error logging out",
    });
  }
});

module.exports = userRouter;
