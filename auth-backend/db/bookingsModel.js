const mongoose = require("mongoose");

const BookingsSchema = new mongoose.Schema({
  student: {
    type: "string",
    required: [true, "Please provide a student!"],
  },
  facility: {
    type: "string",
    required: [true, "Please provide a facility!"],
  },
  slot_ID: {
    type: String,
    required: [true, "Please provide a slot ID"],
  },
});

module.exports =
  mongoose.model.Booking || mongoose.model("Bookings", BookingsSchema);
