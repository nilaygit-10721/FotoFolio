// routes/stats.routes.js
const express = require("express");
const router = express.Router();
const { getUserStats } = require("../controller/stats.controller");
const protect = require("../middleware/auth.middleware");

router.get("/:userId/stats", protect, getUserStats);

module.exports = router;
