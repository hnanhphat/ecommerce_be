const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment.controller");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route GET api/appointments?page=1&limit=10
 * @description Get list of appointments with pagination
 * @access Public
 */
router.get("/", appointmentController.getListOfAppointments);

/**
 * @route POST api/appointments
 * @description Create a new appointment
 * @access Admin
 */
router.post(
  "/add/:id",
  authMiddleware.loginRequired,
  appointmentController.sendRequest
);

/**
 * @route GET api/appointments/:id
 * @description Get a single appointment
 * @access Public
 */
router.get("/:id", appointmentController.getSingleAppointment);

/**
 * @route PUT api/appointments/:id
 * @description Update a appointment
 * @access Admin or Reader
 */
router.put("/:id", appointmentController.updateSingleAppointment);

/**
 * @route DELETE api/appointments/:id
 * @description Delete a appointment
 * @access Admin or Reader
 */
router.delete("/:id", appointmentController.deleteSingleAppointment);

module.exports = router;
