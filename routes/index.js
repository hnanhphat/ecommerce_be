const express = require("express");
const router = express.Router();

const appointmentApi = require("./appointment.api");
const authApi = require("./auth.api");
const cartApi = require("./cart.api");
const decksApi = require("./decks.api");
const newsApi = require("./news.api");
const orderApi = require("./order.api");
const reactionApi = require("./reaction.api");
const reviewApi = require("./review.api");
const userApi = require("./user.api");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({ status: "ok", data: "Hello World!" });
});

router.use("/appointments", appointmentApi);
router.use("/auth", authApi);
router.use("/cart", cartApi);
router.use("/decks", decksApi);
router.use("/news", newsApi);
router.use("/order", orderApi);
router.use("/reaction", reactionApi);
router.use("/review", reviewApi);
router.use("/users", userApi);

module.exports = router;
