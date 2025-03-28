const Comment = require("../models/Comment");
const Photo = require("../models/Photo");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const { createActivity } = require("./activity.controller");
const { createNotification } = require("./notification.controller");

// @desc    Get comments for a photo
// @route   GET /api/photos/:photoId/comments
// @access  Public
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      photo: req.params.photoId,
      isReply: false,
    })
      .populate("user", "username avatar")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "username avatar",
        },
      })
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add comment to a photo
// @route   POST /api/photos/:photoId/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const photoId = req.params.photoId;

    // Check if photo exists
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return next(new ErrorResponse("Photo not found", 404));
    }

    const comment = await Comment.create({
      content,
      photo: photoId,
      user: req.user.id,
    });

    // Populate user data for response
    await comment.populate("user", "username avatar");

    // Record activity
    await createActivity(req.user.id, "comment", {
      photo: photo._id,
      comment: comment._id,
    });

    // Create notification for photo owner (if not the commenter)
    if (photo.user && photo.user.toString() !== req.user.id) {
      await createNotification({
        recipient: photo.user,
        sender: req.user.id,
        type: "comment",
        photo: photo._id,
        comment: comment._id,
      });
    }

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reply to a comment
// @route   POST /api/comments/:commentId/replies
// @access  Private
exports.addReply = async (req, res, next) => {
  try {
    const { content } = req.body;
    const parentCommentId = req.params.commentId;

    // Check if parent comment exists
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      return next(new ErrorResponse("Comment not found", 404));
    }

    const reply = await Comment.create({
      content,
      photo: parentComment.photo,
      user: req.user.id,
      isReply: true,
      parentComment: parentCommentId,
    });

    // Add reply to parent comment
    parentComment.replies.push(reply._id);
    await parentComment.save();

    // Populate user data for response
    await reply.populate("user", "username avatar");

    // Record activity
    await createActivity(req.user.id, "comment_reply", {
      photo: parentComment.photo,
      comment: parentComment._id,
      reply: reply._id,
    });

    // Create notification for parent commenter (if not the replier)
    if (parentComment.user.toString() !== req.user.id) {
      await createNotification({
        recipient: parentComment.user,
        sender: req.user.id,
        type: "comment_reply",
        photo: parentComment.photo,
        comment: parentComment._id,
        reply: reply._id,
      });
    }

    res.status(201).json({
      success: true,
      data: reply,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Like a comment
// @route   POST /api/comments/:commentId/like
// @access  Private
exports.likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(new ErrorResponse("Comment not found", 404));
    }

    // Check if user already liked this comment
    if (comment.likes.includes(req.user.id)) {
      return next(new ErrorResponse("You already liked this comment", 400));
    }

    comment.likes.push(req.user.id);
    await comment.save();

    // Create notification for comment owner (if not the liker)
    if (comment.user.toString() !== req.user.id) {
      await createNotification({
        recipient: comment.user,
        sender: req.user.id,
        type: "comment_like",
        photo: comment.photo,
        comment: comment._id,
      });
    }

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Unlike a comment
// @route   DELETE /api/comments/:commentId/like
// @access  Private
exports.unlikeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(new ErrorResponse("Comment not found", 404));
    }

    // Check if user hasn't liked this comment
    if (!comment.likes.includes(req.user.id)) {
      return next(new ErrorResponse("You have not liked this comment", 400));
    }

    comment.likes = comment.likes.filter(
      (userId) => userId.toString() !== req.user.id.toString()
    );
    await comment.save();

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(new ErrorResponse("Comment not found", 404));
    }

    // Check if user is the comment owner
    if (comment.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse("Not authorized to delete this comment", 401)
      );
    }

    // If it's a parent comment, delete all replies first
    if (!comment.isReply && comment.replies.length > 0) {
      await Comment.deleteMany({ _id: { $in: comment.replies } });
    }

    await comment.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
