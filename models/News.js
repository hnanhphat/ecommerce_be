const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsSchema = Schema(
  {
    reactions: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      care: { type: Number, default: 0 },
      laugh: { type: Number, default: 0 },
      wow: { type: Number, default: 0 },
      sad: { type: Number, default: 0 },
      angry: { type: Number, default: 0 },
    },
    image: {
      type: String,
      required: false,
      default: "",
    },
    title: { type: String, required: [true, "News itle is required"] },
    content: {
      type: String,
      required: [true, "News content is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    reviews: {
      type: mongoose.Schema.Types.Array,
      ref: "Review",
      required: [false],
      default: [],
    },
    category: { type: String, required: [true, "Category is required"] },
    isDelete: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);

module.exports = News;
