const Review = require("../models/Review");
const mongoose = require("mongoose");

const reviewController = {};

// Get list of reviews in a blog
reviewController.getListOfReview = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Create a review
reviewController.createReview = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { targetType, targetId, content } = req.body;
    const isExist = await mongoose.model(targetType).findById(targetId);
    if (!isExist) {
      throw new Error("Blog not found");
    }

    const reviews = new Review({
      author: userId,
      targetType: targetType,
      targetId: targetId,
      content: content,
    });
    await reviews.save();

    // await mongoose
    //   .model(targetType)
    //   .findByIdAndUpdate(
    //     targetId,
    //     { $push: { reviews: reviews } },
    //     { new: true }
    //   );

    res.status(200).json({
      success: true,
      data: reviews,
      message: "Create new review successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update a review
reviewController.updateReview = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete a review
reviewController.deleteReview = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = reviewController;
