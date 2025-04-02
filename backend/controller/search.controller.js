const Photo = require("../models/Photo");
const Board = require("../models/Board");
const User = require("../models/User");
const mongoose = require("mongoose");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Global search
// @route   GET /api/search
// @access  Public
exports.globalSearch = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return next(
        new ErrorResponse(
          "Please provide a search query (at least 2 characters)",
          400
        )
      );
    }

    // Search all collections in parallel
    const [photos, boards, users] = await Promise.all([
      // Photo search (by tags and photographer)
      Photo.find({
        $or: [
          { tags: { $regex: query, $options: "i" } },
          { photographer: { $regex: query, $options: "i" } },
        ],
      })
        .limit(10)
        .select("imageUrl thumbUrl photographer tags likes")
        .populate("likes", "username"),

      // Board search (by title and description)
      Board.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
        isPrivate: false,
      })
        .limit(10)
        .select("title description coverPhoto photos createdAt")
        .populate("coverPhoto", "thumbUrl")
        .populate("user", "username avatar"),

      // User search (by username)
      mongoose
        .model("user_foto")
        .find({
          username: { $regex: query, $options: "i" },
        })
        .limit(10)
        .select("username avatar bio followers following"),
    ]);

    res.status(200).json({
      success: true,
      data: {
        photos,
        boards,
        users,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Advanced photo search
// @route   GET /api/search/photos
// @access  Public
exports.photoSearch = async (req, res, next) => {
  try {
    const { query, sortBy = "popular", limit = 20, page = 1 } = req.query;

    if (!query || query.length < 2) {
      return next(
        new ErrorResponse(
          "Please provide a search query (at least 2 characters)",
          400
        )
      );
    }

    // Build search query
    const searchQuery = {
      $or: [
        { tags: { $regex: query, $options: "i" } },
        { photographer: { $regex: query, $options: "i" } },
      ],
    };

    // Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "popular":
      default:
        sortOptions = { likes: -1 };
    }

    // Execute query with pagination
    const photos = await Photo.find(searchQuery)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("imageUrl thumbUrl photographer tags likes createdAt")
      .populate("likes", "username");

    // Get total count for pagination
    const total = await Photo.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      count: photos.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: photos,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get specific user profile
// @route   GET /api/search/users/:username
// @access  Public
exports.getUserByUsername = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password")
      .populate("followers", "username avatar")
      .populate("following", "username avatar");

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Get counts
    const photosCount = await Photo.countDocuments({ user: user._id });
    const boardsCount = await Board.countDocuments({ user: user._id });

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        stats: {
          photosCount,
          boardsCount,
          followersCount: user.followers.length,
          followingCount: user.following.length,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Advanced user search
// @route   GET /api/search/users
// @access  Public
exports.userSearch = async (req, res, next) => {
  try {
    const { query, limit = 20, page = 1 } = req.query;

    if (!query || query.length < 2) {
      return next(
        new ErrorResponse(
          "Please provide a search query (at least 2 characters)",
          400
        )
      );
    }

    const users = await User.find({
      username: { $regex: query, $options: "i" },
    })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("username avatar bio createdAt")
      .lean();

    // Add counts for each user
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const followersCount = await User.countDocuments({
          followers: user._id,
        });
        const followingCount = user.following?.length || 0;
        const photosCount = await Photo.countDocuments({ user: user._id });

        return {
          ...user,
          followersCount,
          followingCount,
          photosCount,
        };
      })
    );

    const total = await User.countDocuments({
      username: { $regex: query, $options: "i" },
    });

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: usersWithCounts,
    });
  } catch (err) {
    next(err);
  }
};
