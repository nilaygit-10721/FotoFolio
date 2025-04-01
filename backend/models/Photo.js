const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema({
  unsplashId: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  thumbUrl: {
    type: String,
    required: true,
  },
  photographer: {
    type: String,
    required: true,
  },
  photographerUrl: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_foto",
    },
  ],
  saves: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_foto",
    },
  ],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add index for faster queries
PhotoSchema.index({ unsplashId: 1 });
PhotoSchema.index({ tags: 1 });

module.exports = mongoose.model("Photo", PhotoSchema);
