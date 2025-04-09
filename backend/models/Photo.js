const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema(
  {
    // Identification fields
    sourceType: {
      type: String,
      required: true,
      enum: ["unsplash", "user_upload"],
      default: "user_upload",
    },
    unsplashId: {
      type: String,
      required: function () {
        return this.sourceType === "unsplash";
      },
      sparse: true,
    },
    slug: {
      // New field
      type: String,
      required: function () {
        return this.sourceType === "unsplash";
      },
      sparse: true,
    },

    // Image URLs
    imageUrl: {
      type: String,
      required: true,
    },
    thumbUrl: {
      type: String,
      required: function () {
        return this.sourceType === "unsplash";
      },
    },
    downloadUrl: {
      // New field
      type: String,
      required: function () {
        return this.sourceType === "unsplash";
      },
      sparse: true,
    },

    // Photographer information
    photographer: {
      type: String,
      required: function () {
        return this.sourceType === "unsplash";
      },
    },
    photographerUrl: {
      type: String,
      required: function () {
        return this.sourceType === "unsplash";
      },
    },
    photographerImage: {
      // New field
      type: String,
      required: function () {
        return this.sourceType === "unsplash";
      },
      sparse: true,
    },

    // User information
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_foto",
      required: false,
    },

    // Engagement metrics
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

    // Content information
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    tags: {
      type: [String],
      index: true,
    },

    // Image metadata
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    color: {
      type: String,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for like count
PhotoSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// Virtual for save count
PhotoSchema.virtual("saveCount").get(function () {
  return this.saves.length;
});

// Indexes for performance
PhotoSchema.index({ unsplashId: 1 }, { sparse: true });
PhotoSchema.index({ slug: 1 }, { sparse: true }); // New index
PhotoSchema.index({ tags: 1 });
PhotoSchema.index({ user: 1 });
PhotoSchema.index({ sourceType: 1 });

// Middleware to update thumbUrl for user uploads if not provided
PhotoSchema.pre("save", function (next) {
  if (this.sourceType === "user_upload" && !this.thumbUrl) {
    this.thumbUrl = this.imageUrl;
  }
  next();
});

module.exports = mongoose.model("Photo", PhotoSchema);
