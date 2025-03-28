const Notification = require("../models/Notification");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// Helper function to create notification (used by other controllers)
exports.createNotification = async ({
  recipient,
  sender,
  type,
  photo,
  comment,
  reply,
}) => {
  await Notification.create({
    recipient,
    sender,
    type,
    photo,
    comment,
    reply,
  });
};

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort("-createdAt")
      .limit(20)
      .populate("sender", "username avatar")
      .populate("photo", "thumbUrl")
      .populate("comment", "content")
      .populate("reply", "content");

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark notifications as read
// @route   PUT /api/notifications/mark-read
// @access  Private
exports.markNotificationsAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (err) {
    next(err);
  }
};
