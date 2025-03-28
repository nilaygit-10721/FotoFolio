const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const { createActivity } = require("./activity.controller");

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
exports.followUser = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return next(new ErrorResponse("User not found", 404));
    }

    await currentUser.follow(userToFollow._id);

    // Add current user to the followers list of the user being followed
    userToFollow.followers.push(currentUser._id);
    await userToFollow.save();

    // Create notification
    await createNotification({
      recipient: userToFollow._id,
      sender: req.user.id,
      type: "follow",
    });

    res.status(200).json({
      success: true,
      data: {
        following: currentUser.following,
        followers: userToFollow.followers,
      },
    });
    await createActivity(req.user.id, "follow", {
      targetUser: userToFollow._id,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Unfollow a user
// @route   DELETE /api/users/:id/follow
// @access  Private
exports.unfollowUser = async (req, res, next) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return next(new ErrorResponse("User not found", 404));
    }

    await currentUser.unfollow(userToUnfollow._id);

    // Remove current user from the followers list of the user being unfollowed
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (follower) => follower.toString() !== currentUser._id.toString()
    );
    await userToUnfollow.save();

    res.status(200).json({
      success: true,
      data: {
        following: currentUser.following,
        followers: userToUnfollow.followers,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's followers
// @route   GET /api/users/:id/followers
// @access  Public
exports.getFollowers = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers",
      "username avatar bio"
    );

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    res.status(200).json({
      success: true,
      count: user.followers.length,
      data: user.followers,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get users followed by a user
// @route   GET /api/users/:id/following
// @access  Public
exports.getFollowing = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "following",
      "username avatar bio"
    );

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    res.status(200).json({
      success: true,
      count: user.following.length,
      data: user.following,
    });
  } catch (err) {
    next(err);
  }
};
