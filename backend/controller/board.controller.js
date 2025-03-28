const Board = require("../models/Board");
const Photo = require("../models/Photo");
const ErrorResponse = require("../utils/errorResponse");
const { createActivity } = require("./activity.controller");

// @desc    Get all boards for a user
// @route   GET /api/boards
// @access  Private
exports.getUserBoards = async (req, res, next) => {
  try {
    const boards = await Board.find({ user: req.user.id })
      .populate("coverPhoto", "thumbUrl")
      .sort("-updatedAt");

    res.status(200).json({
      success: true,
      count: boards.length,
      data: boards,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single board
// @route   GET /api/boards/:id
// @access  Private
exports.getBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate("user", "username avatar")
      .populate("photos", "imageUrl thumbUrl photographer")
      .populate("coverPhoto", "imageUrl thumbUrl");

    if (!board) {
      return next(new ErrorResponse("Board not found", 404));
    }

    // Check if board is private and belongs to the user
    if (board.isPrivate && board.user._id.toString() !== req.user.id) {
      return next(
        new ErrorResponse("Not authorized to access this board", 401)
      );
    }

    res.status(200).json({
      success: true,
      data: board,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new board
// @route   POST /api/boards
// @access  Private
exports.createBoard = async (req, res, next) => {
  try {
    const { title, description, isPrivate } = req.body;

    const board = await Board.create({
      title,
      description,
      isPrivate,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: board,
    });
    await createActivity(req.user.id, "create_board", { board: board._id });
  } catch (err) {
    next(err);
  }
};

// @desc    Update board
// @route   PUT /api/boards/:id
// @access  Private
exports.updateBoard = async (req, res, next) => {
  try {
    let board = await Board.findById(req.params.id);

    if (!board) {
      return next(new ErrorResponse("Board not found", 404));
    }

    // Make sure user is board owner
    if (board.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse("Not authorized to update this board", 401)
      );
    }

    board = await Board.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: board,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete board
// @route   DELETE /api/boards/:id
// @access  Private
exports.deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return next(new ErrorResponse("Board not found", 404));
    }

    // Make sure user is board owner
    if (board.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse("Not authorized to delete this board", 401)
      );
    }

    await board.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add photo to board
// @route   POST /api/boards/:id/photos
// @access  Private
exports.addPhotoToBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    const { photoId } = req.body;

    if (!board) {
      return next(new ErrorResponse("Board not found", 404));
    }

    // Make sure user is board owner
    if (board.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse("Not authorized to modify this board", 401)
      );
    }

    // Check if photo exists in our DB
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return next(new ErrorResponse("Photo not found", 404));
    }

    // Check if photo is already in the board
    if (board.photos.includes(photoId)) {
      return next(new ErrorResponse("Photo already in this board", 400));
    }

    // Add photo to board
    board.photos.push(photoId);

    // If no cover photo, set this as cover
    if (!board.coverPhoto) {
      board.coverPhoto = photoId;
    }

    await board.save();

    res.status(200).json({
      success: true,
      data: board,
    });
    // Record activity
    await createActivity(req.user.id, "add_photo", {
      photo: photoId,
      board: board._id,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove photo from board
// @route   DELETE /api/boards/:id/photos/:photoId
// @access  Private
exports.removePhotoFromBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    const { photoId } = req.params;

    if (!board) {
      return next(new ErrorResponse("Board not found", 404));
    }

    // Make sure user is board owner
    if (board.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse("Not authorized to modify this board", 401)
      );
    }

    // Remove photo from board
    board.photos = board.photos.filter((photo) => photo.toString() !== photoId);

    // If removed photo was cover photo, set new cover
    if (board.coverPhoto && board.coverPhoto.toString() === photoId) {
      board.coverPhoto = board.photos.length > 0 ? board.photos[0] : null;
    }

    await board.save();

    res.status(200).json({
      success: true,
      data: board,
    });
  } catch (err) {
    next(err);
  }
};
