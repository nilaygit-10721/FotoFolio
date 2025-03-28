const Activity = require("../models/Activity");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get user's activity feed
// @route   GET /api/activity/me
// @access  Private
exports.getMyActivity = async (req, res, next) => {
  try {
    const activities = await Activity.find({ user: req.user.id })
      .sort("-createdAt")
      .populate("photo", "imageUrl thumbUrl")
      .populate("board", "title")
      .populate("targetUser", "username avatar")
      .limit(20);

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get following users' activity
// @route   GET /api/activity/following
// @access  Private
exports.getFollowingActivity = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const activities = await Activity.find({
      user: { $in: user.following },
    })
      .sort("-createdAt")
      .populate("user", "username avatar")
      .populate("photo", "imageUrl thumbUrl")
      .populate("board", "title")
      .limit(20);

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to create activity (used by other controllers)
exports.createActivity = async (userId, type, options = {}) => {
  const activityData = {
    user: userId,
    type,
  };

  if (options.photo) activityData.photo = options.photo;
  if (options.board) activityData.board = options.board;
  if (options.targetUser) activityData.targetUser = options.targetUser;

  await Activity.create(activityData);
};
