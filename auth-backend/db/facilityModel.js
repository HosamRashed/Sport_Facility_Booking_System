const mongoose = require("mongoose");

const FacilitySchema = new mongoose.Schema({
  name: { required: true, type: "string", unique: true },
  description: { required: true, type: "string" },
  image: { required: true, type: "string" },
  availableFrom: { type: "string" },
  availableTo: { type: "string" },
  location: { type: "string" },
  duration: { type: "string" },
  slotTime: {
    type: [Number],
  },
  reservationTimes: [
    {
      userID: {
        type: "string",
      },
      date: {
        type: "string",
      },
    },
  ],
  rating: [
    {
      userID: {
        type: "string",
      },
      value: {
        type: Number,
      },
    },
  ],
  selectedDays: [],
  calendar: {
    type: [
      {
        date: { type: "string" },
        day: { type: "string" },
        slots: [
          {
            time: [Number],
            availability: { type: "string" },
            type: { type: "string" },
            userID: { type: Number },
            prevType: { type: "string" },
          },
        ],
      },
    ],
  },
});

module.exports = mongoose.model("Facility", FacilitySchema);
