const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema({}, { timestamps: true });

orderSchema.plugin(require("./plugins/isDeletedFalse"));

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
