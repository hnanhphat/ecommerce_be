const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route POST api/cart
 * @description Create a new cart
 * @access Login required
 */
router.post("/", authMiddleware.loginRequired, cartController.createCart);

/**
 * @route GET api/cart?page=1&limit=10
 * @description Get cart with pagination
 * @access Public
 */
router.get("/", authMiddleware.loginRequired, cartController.getUserCart);

/**
 * @route PUT api/cart/:id
 * @description Update a cart
 * @access Public
 */
router.put("/:id", cartController.updateCart);

/**
 * @route DELETE api/cart/:id
 * @description Delete a cart
 * @access Publuc
 */
router.delete("/:id", cartController.deleteCart);

module.exports = router;
