const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = Schema(
  {
    status: {
      type: String,
      required: false,
      default: "",
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User is required"],
      ref: "User",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User is required"],
      ref: "User",
    },
    serviceType: { type: String, required: false, default: "" },
    appointmentDate: {
      type: String,
      required: [true, "Appointment Date is required"],
    },
    clientPhone: { type: String, required: [true, "Client Phone is required"] },
    position: { type: String, required: false, default: "" },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
