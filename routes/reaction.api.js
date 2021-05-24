const express = require("express");
const router = express.Router();
const reactionController = require("../controllers/reaction.controller");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route POST api/reaction
 * @description Create a new reaction
 * @access Login required
 */
router.post(
  "/",
  authMiddleware.loginRequired,
  reactionController.createReaction
);

module.exports = router;
