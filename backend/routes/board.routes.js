const express = require("express");
const router = express.Router();
const {
  getUserBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  addPhotoToBoard,
  removePhotoFromBoard,
} = require("../controller/board.controller");
const protect = require("../middleware/auth.middleware");

router.route("/").get(protect, getUserBoards).post(protect, createBoard);

router
  .route("/:id")
  .get(protect, getBoard)
  .put(protect, updateBoard)
  .delete(protect, deleteBoard);

router.post("/:id/photos", protect, addPhotoToBoard);
router.delete("/:id/photos/:photoId", protect, removePhotoFromBoard);

module.exports = router;
