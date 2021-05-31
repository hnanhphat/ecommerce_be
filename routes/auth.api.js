const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validators = require("../middlewares/validators");
const { body } = require("express-validator");
const passport = require("passport");

/**
 * @route POST api/auth/login
 * @description Login
 * @access Public
 */
router.post(
  "/login",
  validators.validate([
    body("email", "Invalid email").exists().isEmail(),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  authController.login
);

/**
 * @route POST api/auth/login/facebook
 * @description Login with Facebook
 * @access Public
 */
router.post(
  "/login/facebook",
  passport.authenticate("facebook-token", { session: false }),
  authController.loginWithFacebookOrGoogle
);

/**
 * @route POST api/auth/login/google
 * @description Login with Google
 * @access Public
 */
router.post(
  "/login/google",
  passport.authenticate("google-token", { session: false }),
  authController.loginWithFacebookOrGoogle
);

module.exports = router;
