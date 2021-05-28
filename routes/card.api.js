const express = require("express");
const router = express.Router();
const cardController = require("../controllers/card.controller");

/**
 * @route POST api/card
 * @description Create a card
 * @access Public
 */
router.post("/", cardController.createCard);

/**
 * @route POST api/card
 * @description Get list of cards
 * @access Public
 */
router.get("/", cardController.getListOfCards);

/**
 * @route GET api/card/me
 * @description Get random card
 * @access Login required
 */
router.get("/:count", cardController.getRandomCard);

module.exports = router;
