// controllers/stats.controller.js
const User = require("../models/User");
const Board = require("../models/Board");
const Photo = require("../models/Photo");
const Activity = require("../models/Activity");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get user dashboard stats
// @route   GET /api/users/:userId/stats
// @access  Private
exports.getUserStats = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Verify the requesting user can only access their own stats
    if (userId !== req.user.id) {
      return next(
        new ErrorResponse("Not authorized to access these stats", 401)
      );
    }

    // Get counts in parallel for better performance
    const [boardsCount, photosCount, followersCount, recentActivity] =
      await Promise.all([
        Board.countDocuments({ user: userId }),
        Photo.countDocuments({ user: userId }),
        User.countDocuments({ following: userId }),
        Activity.find({ user: userId })
          .sort("-createdAt")
          .limit(5)
          .populate("targetUser", "username avatar"),
      ]);

    res.status(200).json({
      success: true,
      data: {
        boardsCount,
        photosCount,
        followersCount,
        recentActivity,
      },
    });
  } catch (err) {
    next(err);
  }
};
