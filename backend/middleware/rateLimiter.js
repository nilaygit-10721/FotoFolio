const rateLimit = require("express-rate-limit");

// General rate limiter for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Strict rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 20 requests per windowMs
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
});

module.exports = { apiLimiter, authLimiter };
