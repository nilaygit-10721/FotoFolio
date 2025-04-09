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

    // Format the response to match our model
    const photos = response.data.results.map((photo) => ({
      sourceType: "unsplash",
      unsplashId: photo.id,
      imageUrl: photo.urls.regular,
      thumbUrl: photo.urls.thumb,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      photographerImage: photo.user.profile_image.small,
      slug: photo.slug,
      downloadUrl: photo.links.download,
      description: photo.description || photo.alt_description,
      tags: photo.tags ? photo.tags.map((tag) => tag.title) : [],
      width: photo.width,
      height: photo.height,
      color: photo.color,
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

// Helper function to fetch photo from Unsplash
const fetchFromUnsplash = async (id) => {
  try {
    if (!/^[a-zA-Z0-9-_]+$/.test(id)) {
      throw new ErrorResponse("Invalid Unsplash photo ID format", 400);
    }

    const response = await axios.get(`https://api.unsplash.com/photos/${id}`, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        "Accept-Version": "v1",
      },
      timeout: 5000,
    });

    if (!response.data) {
      throw new ErrorResponse("Empty response from Unsplash", 502);
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new ErrorResponse("Photo not found on Unsplash", 404);
      }
      if (error.response.status === 403) {
        throw new ErrorResponse("Unsplash API rate limit exceeded", 429);
      }
    }
    throw error instanceof ErrorResponse
      ? error
      : new ErrorResponse("Error contacting Unsplash API", 502);
  }
};

// @desc    Get photo by ID
// @route   GET /api/photos/:id
// @access  Public
exports.getPhotoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new ErrorResponse("Photo ID is required", 400));
    }

    // Check MongoDB ID first
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const photo = await Photo.findById(id)
        .populate("likes", "username avatar")
        .populate("saves", "username avatar");

      if (photo) {
        return res.status(200).json({
          success: true,
          data: photo,
        });
      }
    }

    // Check by unsplashId
    let photo = await Photo.findOne({ unsplashId: id })
      .populate("likes", "username avatar")
      .populate("saves", "username avatar");

    // Fetch from Unsplash if not found
    if (!photo) {
      const unsplashPhoto = await fetchFromUnsplash(id);

      photo = await Photo.create({
        sourceType: "unsplash",
        unsplashId: unsplashPhoto.id,
        imageUrl: unsplashPhoto.urls.regular,
        thumbUrl: unsplashPhoto.urls.thumb,
        photographer: unsplashPhoto.user.name,
        photographerUrl: unsplashPhoto.user.links.html,
        photographerImage: unsplashPhoto.user.profile_image.small,
        slug: unsplashPhoto.slug,
        downloadUrl: unsplashPhoto.links.download,
        description: unsplashPhoto.description || unsplashPhoto.alt_description,
        tags: unsplashPhoto.tags?.map((tag) => tag.title) || [],
        width: unsplashPhoto.width,
        height: unsplashPhoto.height,
        color: unsplashPhoto.color,
      });
    }

    res.status(200).json({
      success: true,
      data: photo,
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
    let photo = await Photo.findOne({
      $or: [{ _id: id }, { unsplashId: id }],
    });

    // If not, create a new record from Unsplash
    if (!photo) {
      const unsplashPhoto = await fetchFromUnsplash(id);

      photo = await Photo.create({
        sourceType: "unsplash",
        unsplashId: unsplashPhoto.id,
        imageUrl: unsplashPhoto.urls.regular,
        thumbUrl: unsplashPhoto.urls.thumb,
        photographer: unsplashPhoto.user.name,
        photographerUrl: unsplashPhoto.user.links.html,
        photographerImage: unsplashPhoto.user.profile_image?.medium,
        slug: unsplashPhoto.slug,
        downloadUrl: unsplashPhoto.links.download,
        description: unsplashPhoto.description || unsplashPhoto.alt_description,
        tags: unsplashPhoto.tags?.map((tag) => tag.title) || [],
        width: unsplashPhoto.width,
        height: unsplashPhoto.height,
        color: unsplashPhoto.color,
      });
    }

    // Check if user already liked this photo
    if (photo.likes.includes(userId)) {
      return next(new ErrorResponse("You already liked this photo", 400));
    }

    // Add like
    photo.likes.push(userId);
    await photo.save();

    // Create activity log
    await createActivity(req.user.id, "like", { photo: photo._id });

    res.status(200).json({
      success: true,
      data: photo,
    });
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

    const photo = await Photo.findOne({
      $or: [{ _id: id }, { unsplashId: id }],
    });

    if (!photo) {
      return next(new ErrorResponse("Photo not found", 404));
    }

    if (!photo.likes.includes(userId)) {
      return next(new ErrorResponse("You have not liked this photo", 400));
    }

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

// @desc    Upload a photo
// @route   POST /api/photos
// @access  Private
exports.uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse("Please upload an image file", 400));
    }

    const { title, description } = req.body;
    let tags = [];

    try {
      tags = JSON.parse(req.body.tags);
    } catch (e) {
      tags = [];
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const photo = await Photo.create({
      sourceType: "user_upload",
      imageUrl,
      thumbUrl: imageUrl, // Will be handled by pre-save hook
      user: req.user.id,
      title,
      description,
      tags,
    });

    res.status(201).json({
      success: true,
      data: photo,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get photo comments
// @route   GET /api/photos/:id/comments
// @access  Public
exports.getPhotoComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ photo: req.params.id })
      .populate("user", "username avatar")
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
