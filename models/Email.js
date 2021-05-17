const mongoose = require("mongoose");

const emailSchema = mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    description: { type: String, required: [true, "Description is required"] },
    email_key: {
      type: String,
      required: [true, "Template Key is required"],
      unique: true,
    },
    from: { type: String, required: [true, "From is required"] },
    html: { type: String, required: [true, "HTML is required"] },
    subject: { type: String, required: [true, "Subjectis required"] },
    variables: [{ type: String, required: [true, "Variables required"] }],
  },
  { timestamps: true }
);

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;
