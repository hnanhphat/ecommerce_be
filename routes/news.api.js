const express = require("express");
const router = express.Router();
const newsController = require("../controllers/news.controller");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route POST api/news
 * @description Create a new news
 * @access Login required as Reader
 */
router.post("/", authMiddleware.loginRequired, newsController.createNews);

/**
 * @route GET api/news/:id
 * @description Get a single news
 * @access Public
 */
router.get("/:id", newsController.getSingleNews);

/**
 * @route GET api/news?page=1&limit=10
 * @description Get news with pagination
 * @access Public
 */
router.get("/", newsController.getListOfNews);

/**
 * @route PUT api/news/:id
 * @description Update a news
 * @access Public
 */
router.put(
  "/:id",
  authMiddleware.loginRequired,
  newsController.updateSingleNews
);

/**
 * @route DELETE api/news/:id
 * @description Delete a news
 * @access Publuc
 */
router.delete(
  "/:id",
  authMiddleware.loginRequired,
  newsController.deleteSingleNews
);

module.exports = router;
