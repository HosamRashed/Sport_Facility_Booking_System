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
  day: {
    type: String,
    required: [true, "Please provide the booked day"],
  },
});

module.exports =
  mongoose.model.Booking || mongoose.model("Bookings", BookingsSchema);
