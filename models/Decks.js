const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const decksSchema = Schema(
  {
    images: { type: String, required: false, default: "" },
    name: { type: String, required: [true, "Name is required"] },
    description: {
      type: String,
      required: [true, "Description content is required"],
    },
    sale: { type: Boolean, required: false, default: false },
    defaultPrice: { type: Number, required: false, default: null },
    oficialPrice: { type: Number, required: true },
    genres: { type: String, required: [true, "Genre is required"] },
    color: { type: String, required: [true, "Color is required"] },
    size: { type: String, required: [true, "Size is required"] },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

decksSchema.plugin(require("./plugins/isDeletedFalse"));

const Decks = mongoose.model("Decks", decksSchema);

module.exports = Decks;
