const Photo = require("../models/Photo");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const axios = require("axios");
const { createActivity } = require("./activity.controller");

// @desc    Search photos from Unsplash
// @route   GET /api/photos/search
// @access  Public
exports.searchPhotos = async (req, res, next) => {
  try {
    const { query, page = 1, perPage = 20 } = req.query;

    if (!query) {
      return next(new ErrorResponse("Please provide a search query", 400));
    }

    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query, page, per_page: perPage },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    // Format the response to match our needs
    const photos = response.data.results.map((photo) => ({
      unsplashId: photo.id,
      imageUrl: photo.urls.regular,
      thumbUrl: photo.urls.thumb,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      tags: photo.tags ? photo.tags.map((tag) => tag.title) : [],
    }));

    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Like a photo
// @route   POST /api/photos/:id/like
// @access  Private
exports.likePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // First check if we have this photo in our DB
    let photo = await Photo.findOne({ unsplashId: id });

    // If not, create a new record
    if (!photo) {
      // Fetch photo details from Unsplash
      const response = await axios.get(
        `https://api.unsplash.com/photos/${id}`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      const unsplashPhoto = response.data;

      photo = await Photo.create({
        unsplashId: unsplashPhoto.id,
        imageUrl: unsplashPhoto.urls.regular,
        thumbUrl: unsplashPhoto.urls.thumb,
        photographer: unsplashPhoto.user.name,
        photographerUrl: unsplashPhoto.user.links.html,
        tags: unsplashPhoto.tags
          ? unsplashPhoto.tags.map((tag) => tag.title)
          : [],
      });
    }

    // Check if user already liked this photo
    if (photo.likes.includes(userId)) {
      return next(new ErrorResponse("You already liked this photo", 400));
    }

    // Add like
    photo.likes.push(userId);
    await photo.save();
    // Create notification for photo owner (if not the liker)
    if (photo.user && photo.user.toString() !== req.user.id) {
      await createNotification({
        recipient: photo.user,
        sender: req.user.id,
        type: "like",
        photo: photo._id,
      });
    }

    res.status(200).json({
      success: true,
      data: photo,
    });
    await createActivity(req.user.id, "like", { photo: photo._id });
  } catch (err) {
    next(err);
  }
};

// @desc    Unlike a photo
// @route   DELETE /api/photos/:id/like
// @access  Private
exports.unlikePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const photo = await Photo.findOne({ unsplashId: id });

    if (!photo) {
      return next(new ErrorResponse("Photo not found", 404));
    }

    // Check if user hasn't liked this photo
    if (!photo.likes.includes(userId)) {
      return next(new ErrorResponse("You have not liked this photo", 400));
    }

    // Remove like
    photo.likes = photo.likes.filter(
      (like) => like.toString() !== userId.toString()
    );
    await photo.save();

    res.status(200).json({
      success: true,
      data: photo,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get popular photos
// @route   GET /api/photos/popular
// @access  Public
exports.getPopularPhotos = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const photos = await Photo.find()
      .sort({ likes: -1 })
      .limit(parseInt(limit))
      .populate("likes", "username avatar");

    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos,
    });
  } catch (err) {
    next(err);
  }
};
