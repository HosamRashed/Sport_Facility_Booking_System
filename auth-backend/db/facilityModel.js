const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  time: [String],
  availability: String,
  type: String,
});

const calendarSchema = new mongoose.Schema({
  slots: [slotSchema],
});

const FacilitySchema = new mongoose.Schema({
  name: { required: true, type: "string", unique: true },
  description: { required: true, type: "string" },
  image: { required: true, type: "string" },
  reservationTimes: { type: Number },
  availableFrom: String,
  availableTo: String,
  duration: String,

  selectedDays: [],
  calendar: {
    type: Map,
    of: calendarSchema,
  },
});

module.exports =
  mongoose.model.Facility || mongoose.model("facility", FacilitySchema);
