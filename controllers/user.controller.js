const User = require("../models/User");
const bcrypt = require("bcrypt");
const utilsHelper = require("../helpers/utils.helper");
const { emailHelper } = require("../helpers/email.helper");

const userController = {};

// Register new User
userController.register = async (req, res, next) => {
  try {
    const { avatar, fullname, username, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      throw new Error("User already exists");
    }

    // Encode password first
    const salt = await bcrypt.genSalt(10);
    const encodedPassword = await bcrypt.hash(password, salt);
    const emailVerificationCode = utilsHelper.generateRandomHexString(20);

    // And save encode password
    user = new User({
      avatar,
      fullname,
      username,
      email,
      password: encodedPassword,
      emailVerified: false,
      emailVerificationCode,
    });
    await user.save();

    // Time to send our email with verification code
    const verificationURL = `${process.env.FRONTEND_URL}/verify/${emailVerificationCode}`;
    const emailData = await emailHelper.renderEmailTemplate(
      "verify_email",
      { username, code: verificationURL },
      email
    );

    if (emailData.error) {
      throw new Error(emailData.error);
    } else {
      emailHelper.send(emailData);
    }

    res.status(200).json({
      success: true,
      data: { user: user },
      message: "Create user successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get list of users with pagination
userController.getListOfUsers = async (req, res, next) => {
  try {
    // 1. Read the query information
    let { page, limit, sortBy, fullname, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // 2. Get total user number
    const totalUser = await User.countDocuments({
      fullname: new RegExp(fullname, "i"),
      ...filter,
    });

    // 3. Calculate total page number
    const totalPages = Math.ceil(totalUser / limit);

    // 4. Calculate how many data you will skip (offset)
    const offset = (page - 1) * limit;

    // 5. Get user based on query info
    let users = await User.find({
      fullname: new RegExp(fullname, "i"),
      ...filter,
    })
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: { users, totalPages },
      message: "Get list of users successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get current user
userController.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "Get current user successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single user
userController.getSingleUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "Get single user successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update single user
userController.updateSingleUser = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User not found");
    }

    const { avatar, fullname, username, position, role } = req.body;
    const userUpdate = await User.findByIdAndUpdate(
      req.params.id,
      { fullname, username, avatar, position, role },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: userUpdate,
      message: "Update Profile successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update current user
userController.updateUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const { avatar, fullname, username, position } = req.body;
    const userUpdate = await User.findByIdAndUpdate(
      userId,
      { fullname, username, avatar, position },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: userUpdate,
      message: "Update Profile successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Verify email
userController.verifyEmail = async (req, res, next) => {
  try {
    const { code } = req.body;
    let user = await User.findOne({ emailVerificationCode: code });
    if (!user) {
      throw new Error("Invalid Email Verification Token");
    }

    user = await User.findByIdAndUpdate(
      user._id,
      { $set: { emailVerified: true }, $unset: { emailVerificationCode: 1 } },
      { new: true }
    );

    const accessToken = await user.generateToken();

    res.status(200).json({
      success: true,
      data: { user, accessToken },
      message: "Verify Email Successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = userController;
