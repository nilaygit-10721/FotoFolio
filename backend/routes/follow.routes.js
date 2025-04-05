const express = require("express");
const router = express.Router();
const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} = require("../controller/follow.controller");
const protect = require("../middleware/auth.middleware");

router.post("/:id/follow", protect, followUser);
router.delete("/:id/follow", protect, unfollowUser);
router.get("/:id/followers", getFollowers);
router.get("/:id/following", getFollowing);

module.exports = router;
