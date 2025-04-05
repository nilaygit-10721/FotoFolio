const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markNotificationsAsRead,
  getUnreadCount,
} = require("../controller/notification.controller");
const protect = require("../middleware/auth.middleware");

router.get("/", protect, getNotifications);
router.put("/mark-read", protect, markNotificationsAsRead);
router.get("/unread-count", protect, getUnreadCount);

module.exports = router;
