const express = require("express");
const router = express.Router();
const {
  globalSearch,
  photoSearch,
  userSearch,
} = require("../controller/search.controller");

router.get("/", globalSearch);
router.get("/photos", photoSearch);
router.get("/users", userSearch);

module.exports = router;
