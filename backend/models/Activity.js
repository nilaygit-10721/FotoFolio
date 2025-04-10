const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user_foto",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["like", "save", "follow", "create_board", "add_photo"],
  },
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Photo",
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user_foto",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
ActivitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Activity", ActivitySchema);
