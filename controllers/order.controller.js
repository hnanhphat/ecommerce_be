const Order = require("../models/Order");
const Cart = require("../models/Cart");

const orderController = {};

// Create order
orderController.createOrder = async (req, res, next) => {
  try {
    const {
      customer,
      carts,
      status,
      total,
      shipping,
      phone,
      payment,
      quantity,
    } = req.body;
    const order = new Order({
      customer,
      carts,
      status,
      total,
      shipping,
      phone,
      payment,
      quantity,
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

// Get a single order
orderController.getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer")
      .populate({ path: "carts", populate: { path: "decks" } });

    res.status(200).json({
      success: true,
      data: order,
      message: "Get single news successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get User's Orders
orderController.getAllOrder = async (req, res, next) => {
  try {
    // 1. Read the query information
    let { page, limit, sortBy, payment, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // 2. Get total order number
    const totalOrders = await Order.countDocuments({
      payment: new RegExp(payment, "i"),
      ...filter,
    });

    // 3. Calculate total page number
    const totalPages = Math.ceil(totalOrders / limit);

    // 4. Calculate how many data you will skip (offset)
    const offset = (page - 1) * limit;

    // 5. Get order based on query info
    let orders = await Order.find({
      payment: new RegExp(payment, "i"),
      ...filter,
    })
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("carts")
      .populate("customer");

    // 6. Send news + totalPages info
    res.status(200).json({
      success: true,
      data: { orders, totalPages },
      message: "Get user's order successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get User's Orders
orderController.getUserOrder = async (req, res, next) => {
  try {
    const userId = req.userId;
    // 1. Read the query information
    let { page, limit, sortBy, payment, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // 2. Get total order number
    const totalOrders = await Order.countDocuments({ ...filter });

    // 3. Calculate total page number
    const totalPages = Math.ceil(totalOrders / limit);

    // 4. Calculate how many data you will skip (offset)
    const offset = (page - 1) * limit;

    // 5. Get order based on query info
    let orders = await Order.find({
      payment: new RegExp(payment, "i"),
      customer: userId,
      ...filter,
    })
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("carts")
      .populate("customer");

    // 6. Send news + totalPages info
    res.status(200).json({
      success: true,
      data: { orders, totalPages },
      message: "Get user's order successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update a single order
orderController.updateSingleOrder = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: order,
      message: "Update order successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete a single order
orderController.deleteSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: order,
      message: "Delete order successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = orderController;
