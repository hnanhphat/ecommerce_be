const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route POST api/order
 * @description Create a new order
 * @access Login required
 */
router.post("/", authMiddleware.loginRequired, orderController.createOrder);

/**
 * @route GET api/order/:id
 * @description Get a single order
 * @access Public
 */
router.get("/:id", orderController.getSingleOrder);

/**
 * @route GET api/order?page=1&limit=10
 * @description Get order with pagination
 * @access Login required
 */
router.get("/", authMiddleware.loginRequired, orderController.getUserOrder);

/**
 * @route PUT api/order/:id
 * @description Update a order
 * @access Public
 */
router.put("/:id", orderController.updateSingleOrder);

/**
 * @route DELETE api/order/:id
 * @description Delete a order
 * @access Publuc
 */
router.delete("/:id", orderController.deleteSingleOrder);

module.exports = router;
