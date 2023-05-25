const mongoose = require("mongoose");

const BookingsSchema = new mongoose.Schema({

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", // Reference to the student details schema
    required: [true, "Please provide a student!"],
  },
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Facility", // Reference to the facility details schema
    required: [true, "Please provide a facility!"],
  },
  slot_ID: {
    type: String, 
    required: [true, "Please provide a slot ID"]
  }, 
  booking_date: {
    type: String,
    required: [true, "Please provide a booking date!"],
  },
});

module.exports =
  mongoose.model.Booking || mongoose.model("Bookings", BookingsSchema);
