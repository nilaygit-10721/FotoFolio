const express = require("express");
const router = express.Router();
const {
  getMyActivity,
  getFollowingActivity,
} = require("../controller/activity.controller");
const { protect } = require("../middleware/auth");

router.get("/me", protect, getMyActivity);
router.get("/following", protect, getFollowingActivity);

module.exports = router;
