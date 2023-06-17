const mongoose = require("mongoose");

const FacilitySchema = new mongoose.Schema({
  name: { required: true, type: "string", unique: true },
  description: { required: true, type: "string" },
  image: { required: true, type: "string" },
  reservationTimes: { type: Number },
  availableFrom: { type: "string" },
  availableTo: { type: "string" },
  duration: { type: "string" },

  selectedDays: [],
  calender: {
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

module.exports =
  mongoose.model.Facility || mongoose.model("facility", FacilitySchema);
