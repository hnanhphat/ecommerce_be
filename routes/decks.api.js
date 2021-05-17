const express = require("express");
const router = express.Router();
const decksController = require("../controllers/decks.controller");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route POST api/decks
 * @description Create a new decks
 * @access Login required
 */
router.post("/", authMiddleware.loginRequired, decksController.createDecks);

/**
 * @route GET api/decks?page=1&limit=10
 * @description Get decks with pagination
 * @access Public
 */
router.get("/", decksController.getListOfDecks);

/**
 * @route GET api/decks/:id
 * @description Get a single decks
 * @access Public
 */
router.get("/:id", decksController.getSingleDecks);

/**
 * @route PUT api/decks:id
 * @description Update a decks
 * @access Public
 */
router.put("/:id", decksController.updateSingleDecks);

/**
 * @route DELETE api/decks/:id
 * @description Delete a decks
 * @access Publuc
 */
router.delete("/:id", decksController.deleteSingeleDecks);

module.exports = router;
