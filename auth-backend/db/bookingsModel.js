const mongoose = require("mongoose");

const BookingsSchema = new mongoose.Schema({
  studentID: {
    type: "string",
    required: [true, "Please provide a student ID!"],
  },
  facilityID: {
    type: "string",
    required: [true, "Please provide a facility!"],
  },
  studentName: {
    type: "string",
    required: [true, "Please provide a student name!"],
  },
  facilityName: {
    type: "string",
    required: [true, "Please provide a facility!"],
  },
  slot_ID: {
    type: String,
    required: [true, "Please provide a slot ID"],
  },
  slotTime: {
    type: [Number],
    required: [true, "Please provide a slot time as an array"],
  }, 
  slotDate: {
    type: String,
    required: [true, "Please provide the booked slot date"],
  },
  slotDay: {
    type: String,
    required: [true, "Please provide the booked slot day"],
  },
});

module.exports =
  mongoose.model.Booking || mongoose.model("Bookings", BookingsSchema);
