const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment.controller");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route POST api/news
 * @description Create a new news
 * @access Login required as Reader
 */
router.post(
  "/add/:id",
  authMiddleware.loginRequired,
  appointmentController.sendRequest
);

module.exports = router;
