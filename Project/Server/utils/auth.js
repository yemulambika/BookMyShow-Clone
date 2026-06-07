const jwt = require("jsonwebtoken");

const isProd = process.env.NODE_ENV === "production";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";

// 15 minutes / 7 days in milliseconds for cookie maxAge
const ACCESS_COOKIE_MAX_AGE = 15 * 60 * 1000;
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

// In production the client (e.g. Vercel) and API (e.g. Render) are on different
// sites, so the cookie must be SameSite=None + Secure. In local dev over http a
// SameSite=None cookie without Secure is dropped by browsers, so we use Lax.
const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge,
});

const accessCookieOptions = () => cookieOptions(ACCESS_COOKIE_MAX_AGE);
const refreshCookieOptions = () => cookieOptions(REFRESH_COOKIE_MAX_AGE);

const signAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

const signRefreshToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_TTL,
  });

// Set both auth cookies on the response.
const setAuthCookies = (res, userId) => {
  res.cookie("jwtToken", signAccessToken(userId), accessCookieOptions());
  res.cookie("refreshToken", signRefreshToken(userId), refreshCookieOptions());
};

const clearAuthCookies = (res) => {
  const base = { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax" };
  res.clearCookie("jwtToken", base);
  res.clearCookie("refreshToken", base);
};

// Return a safe user object (never expose the password hash).
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

module.exports = {
  signAccessToken,
  signRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  accessCookieOptions,
  refreshCookieOptions,
  sanitizeUser,
};
