const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
    },
    carts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
    status: { type: String, required: false, default: "To Pay" },
    total: { type: Number, required: false, default: 0 },
    shipping: {
      type: String,
      required: [true, "Shipping is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    payment: {
      type: String,
      required: [true, "Payment is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

orderSchema.plugin(require("./plugins/isDeletedFalse"));

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
