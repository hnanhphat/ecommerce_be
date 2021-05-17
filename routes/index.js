const express = require("express");
const router = express.Router();

const authApi = require("./auth.api");
const cartApi = require("./cart.api");
const decksApi = require("./decks.api");
const userApi = require("./user.api");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({ status: "ok", data: "Hello World!" });
});

router.use("/auth", authApi);
router.use("/cart", cartApi);
router.use("/decks", decksApi);
router.use("/users", userApi);

module.exports = router;
