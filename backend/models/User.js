const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
    trim: true,
    maxlength: [30, "Username cannot be more than 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  avatar: {
    type: String,
    default: "https://ui-avatars.com/api/?background=random",
  },
  bio: {
    type: String,
    maxlength: [150, "Bio cannot be more than 150 characters"],
    default: "",
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user_foto" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "user_foto" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to match entered password with hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Follow a user
UserSchema.methods.follow = async function (userId) {
  if (this._id.toString() === userId.toString()) {
    throw new Error("You cannot follow yourself");
  }

  if (this.following.includes(userId)) {
    throw new Error("You are already following this user");
  }

  this.following.push(userId);
  await this.save();
};

// Unfollow a user
UserSchema.methods.unfollow = async function (userId) {
  if (!this.following.includes(userId)) {
    throw new Error("You are not following this user");
  }

  this.following = this.following.filter(
    (id) => id.toString() !== userId.toString()
  );
  await this.save();
};

module.exports = mongoose.model("user_foto", UserSchema);
