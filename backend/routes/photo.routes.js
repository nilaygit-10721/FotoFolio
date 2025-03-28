const express = require("express");
const router = express.Router();
const {
  searchPhotos,
  likePhoto,
  unlikePhoto,
  getPopularPhotos,
} = require("../controller/photo.controller");
const { protect } = require("../middleware/auth");

router.get("/search", searchPhotos);
router.get("/popular", getPopularPhotos);
router.post("/:id/like", protect, likePhoto);
router.delete("/:id/like", protect, unlikePhoto);

module.exports = router;
