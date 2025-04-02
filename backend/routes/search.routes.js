const express = require("express");
const router = express.Router();
const {
  globalSearch,
  photoSearch,
  userSearch,
  getUserByUsername, // Add the new function
} = require("../controller/search.controller");

router.get("/", globalSearch);
router.get("/photos", photoSearch);
router.get("/users", userSearch);
router.get("/users/:username", getUserByUsername); // Add the new route

module.exports = router;
