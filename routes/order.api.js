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

module.exports = router;
