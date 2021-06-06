const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const decksSchema = Schema(
  {
    image: { type: String, required: false, default: "" },
    name: { type: String, required: [true, "Name is required"] },
    description: {
      type: String,
      required: [true, "Description content is required"],
    },
    sale: { type: Boolean, required: false, default: false },
    defaultPrice: { type: Number, required: true },
    oficialPrice: { type: Number, required: true },
    category: { type: String, required: [true, "Category is required"] },
    genres: { type: String, required: false, default: "Other" },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

decksSchema.plugin(require("./plugins/isDeletedFalse"));

const Decks = mongoose.model("Decks", decksSchema);

module.exports = Decks;
