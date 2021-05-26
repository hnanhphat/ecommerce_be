const Appointment = require("../models/Appointment");
const User = require("../models/User");

const appointmentController = {};

// Send request
appointmentController.sendRequest = async (req, res, next) => {
  try {
    const fromId = req.userId;
    const toId = req.params.id;
    const { serviceType, appointmentDate, clientPhone } = req.body;

    const targetUser = await User.findById(toId);
    if (!targetUser) {
      throw new Error("User not found");
    }

    const appointment = await Appointment({
      status: "Requesting",
      from: fromId,
      to: toId,
      serviceType,
      appointmentDate,
      clientPhone,
    });
    await appointment.save();

    res.status(200).json({
      success: true,
      data: appointment,
      message: "Request has ben sent",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Cancel request
appointmentController.cancelRequest = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Accept request
appointmentController.acceptRequest = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Decline request
appointmentController.declineRequest = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Remove request
appointmentController.removeRequest = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get list of sent requests
appointmentController.getListOfSentRequest = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get list of received requests
appointmentController.getListOfReceivedRequest = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = appointmentController;
