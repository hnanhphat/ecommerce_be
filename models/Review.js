const mongoose = require("mongoose");
const reviewSchema = mongoose.Schema(
  {
    reactions: {
      type: Object,
      required: [false],
      ref: "Reaction",
      default: {
        like: 0,
        love: 0,
        care: 0,
        laugh: 0,
        wow: 0,
        sad: 0,
        angry: 0,
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    targetType: {
      type: String,
      required: [true, "Target type is required"],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Target ID is required"],
      refPath: "targetType",
    },
    content: { type: String, required: [true, "Content is required"] },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
