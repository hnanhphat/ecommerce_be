const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const { body } = require("express-validator");

/**
 * @route POST api/users
 * @description Register new user
 * @access Public
 */
router.post(
  "/",
  validators.validate([
    body("fullname", "Invalid Fullname").exists().notEmpty(),
    body("username", "Invalid Username").exists().notEmpty(),
    body("email", "Invalid Email").exists().isEmail(),
    body("password", "Invalid Password").exists().notEmpty(),
  ]),
  userController.register
);

/**
 * @route GET api/users?page=1&limit=10
 * @description Get list of users with pagination
 * @access Public
 */
router.get("/", userController.getListOfUsers);

/**
 * @route GET api/users/me
 * @description Get current user info
 * @access Login required
 */
router.get("/me", authMiddleware.loginRequired, userController.getCurrentUser);

/**
 * @route GET api/users/:id
 * @description Get single user info
 * @access Public
 */
router.get("/:id", userController.getSingleUser);

/**
 * @route PUT api/users/me
 * @description Update current user profile
 * @access Login required
 */
router.put("/me", authMiddleware.loginRequired, userController.updateUser);

/**
 * @route PUT api/users:id
 * @description Update single user profile
 * @access Admin or Reader
 */
router.put("/:id", userController.updateSingleUser);

/**
 * @route GET api/users/verify
 * @description Verify email
 * @access Public
 */
router.post("/verify", userController.verifyEmail);

module.exports = router;
