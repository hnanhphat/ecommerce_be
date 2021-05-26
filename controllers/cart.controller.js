const Cart = require("../models/Cart");

const cartController = {};

// Create a new cart
cartController.createCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { decks, quantity } = req.body;
    let cart = await Cart.findOne({
      decks,
      createdBy: userId,
      isOrdered: false,
    });

    if (!cart) {
      cart = new Cart({ decks, quantity, createdBy: userId });
      await cart.save();
    } else {
      cart = await Cart.findOneAndUpdate(
        { decks, createdBy: userId },
        { $inc: { quantity } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: cart,
      message: "Create new cart successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get user's carts
cartController.getUserCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    // 1. Read the query information
    let { page, limit, sortBy, createdBy, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // 2. Get total cart number
    const totalCart = await Cart.countDocuments({
      createdBy: userId,
      ...filter,
    });

    // 3. Calculate total page number
    const totalPages = Math.ceil(totalCart / limit);

    // 4. Calculate how many data you will skip (offset)
    const offset = (page - 1) * limit;

    // 5. Get cart based on query info
    const carts = await Cart.find({ createdBy: userId, ...filter })
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("decks")
      .populate("createdBy");

    // 6. Send cart + totalPages info
    res.status(200).json({
      success: true,
      data: { carts, totalPages },
      message: "Get list of cart successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update single cart
cartController.updateCart = async (req, res, next) => {
  try {
    const cartId = req.params.id;
    const { quantity } = req.body;
    let cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart = await Cart.findByIdAndUpdate(
      cartId,
      { $inc: { quantity } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: cart,
      message: "Update cart successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete singe Cart
cartController.deleteCart = async (req, res, next) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      data: cart,
      message: "Delete cart successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = cartController;
