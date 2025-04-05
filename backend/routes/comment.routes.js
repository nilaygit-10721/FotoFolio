const express = require("express");
const router = express.Router();
const {
  getComments,
  addComment,
  addReply,
  likeComment,
  unlikeComment,
  deleteComment,
} = require("../controller/comment.controller");
const protect = require("../middleware/auth.middleware");

router.get("/photos/:photoId/comments", getComments);
router.post("/photos/:photoId/comments", protect, addComment);
router.post("/comments/:commentId/replies", protect, addReply);
router.post("/comments/:commentId/like", protect, likeComment);
router.delete("/comments/:commentId/like", protect, unlikeComment);
router.delete("/comments/:commentId", protect, deleteComment);

module.exports = router;
