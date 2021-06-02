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

// Get list of appointments
appointmentController.getListOfAppointments = async (req, res, next) => {
  try {
    // 1. Read the query information
    let { page, limit, sortBy, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // 2. Get total appointment number
    const totalAppointment = await Appointment.countDocuments({ ...filter });

    // 3. Calculate total page number
    const totalPages = Math.ceil(totalAppointment / limit);

    // 4. Calculate how many data you will skip (offset)
    const offset = (page - 1) * limit;

    // 5. Get appointment based on query info
    let appointments = await Appointment.find({ ...filter })
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("from")
      .populate("to");

    res.status(200).json({
      success: true,
      data: { appointments, totalPages },
      message: "Get list of appointments successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get a single appointment
appointmentController.getSingleAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("from")
      .populate("to");

    res.status(200).json({
      success: true,
      data: appointment,
      message: "Get single news successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get user's appointments
appointmentController.getUserAppointments = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update a single order
appointmentController.updateSingleAppointment = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: appointment,
      message: "Update appointment successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete a single order
appointmentController.deleteSingleAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: appointment,
      message: "Delete appointment successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = appointmentController;
