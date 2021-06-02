const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userSchema = Schema(
  {
    avatar: { type: String, required: false, default: "" },
    fullname: { type: String, required: [true, "Fullname is required"] },
    username: { type: String, required: [true, "Username is required"] },
    email: {
      type: String,
      required: true,
      unique: [true, "Email is required"],
    },
    password: { type: String, required: true, select: false },
    emailVerificationCode: { type: String, select: true },
    emailVerified: {
      type: Boolean,
      required: [true, "Email Verified is required"],
      default: false,
    },
    role: { type: String, required: false, default: "User" },
    position: { type: String, required: false, default: "" },
    quote: { type: String, required: false, default: "" },
    friendCount: { type: Number, required: false, default: 0 },
    isAdmin: { type: Boolean, require: false, default: false },
    isReader: { type: Boolean, require: false, default: false },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.emailVerified;
  delete obj.emailVerificationCode;
  delete obj.isReader;
  delete obj.isDeleted;
  return obj;
};

userSchema.statics.findOrCreate = function findOrCreate(profile, cb) {
  const userObj = new this();
  this.findOne({ email: profile.email }, async function (error, result) {
    if (!result) {
      // Create new user
      // 1. Make new password
      let newPassword =
        profile.password || "" + Math.floor(Math.random() * 100000000);
      const salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(newPassword, salt);

      // 2. Save user
      userObj.name = profile.name;
      userObj.email = profile.email;
      userObj.password = newPassword;
      userObj.googleId = profile.googleId;
      userObj.facebookId = profile.facebookId;
      userObj.avatarurl = profile.avatarurl;

      // 3. Call the cb
      userObj.save(cb);
    } else {
      // Send that user information back to passport
      cb(error, result);
    }
  });
};

// Generate token
userSchema.methods.generateToken = async function () {
  const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.plugin(require("./plugins/isDeletedFalse"));

const User = mongoose.model("User", userSchema);

module.exports = User;
