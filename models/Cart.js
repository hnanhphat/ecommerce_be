const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = Schema({
  decks: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Decks",
    required: [true, "A decks need a name"],
  },
  quantity: {
    type: Number,
    required: [true, "A decks need a quantity"],
  },
  isOrdered: { type: Boolean, require: false, default: false },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Cart must have a UserId"],
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
