const express = require("express");
const router = express.Router();
const {
  searchPhotos,
  likePhoto,
  unlikePhoto,
  getPopularPhotos,
  getPhotoById,
  getPhotoComments,
  uploadPhoto,
} = require("../controller/photo.controller");
const protect = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/search", searchPhotos);
router.get("/popular", getPopularPhotos);
router.post("/:id/like", protect, likePhoto);
router.delete("/:id/like", protect, unlikePhoto);
router.get("/:id", getPhotoById);
router.get("/:id/comments", getPhotoComments);
router.post("/", protect, upload.single("image"), uploadPhoto);
module.exports = router;
