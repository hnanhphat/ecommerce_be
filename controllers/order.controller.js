const Order = require("../models/Order");
const Cart = require("../models/Cart");

const orderController = {};

// Create order
orderController.createOrder = async (req, res, next) => {
  try {
    const { customer, carts, status, total, shipping, phone } = req.body;
    const order = new Order({
      customer,
      carts,
      status,
      total,
      shipping,
      phone,
    });
    await order.save();

    await Promise.all(
      carts.map(async (cart) => {
        await Cart.findByIdAndUpdate(
          { _id: cart },
          { isOrdered: true },
          { new: true }
        );
      })
    );

    res.status(200).json({
      success: true,
      data: order,
      message: "Create new order successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = orderController;
