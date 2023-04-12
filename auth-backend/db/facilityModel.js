const mongoose = require("mongoose");

const FacilitySchema = new mongoose.Schema({
  name: { required: true, type: "string", unique: true },
  description: { required: true, type: "string" },
  startTime: { required: true, type: "string" },
  endTime: { required: true, type: "string" },
  image: { required: true, type: "string" },
});

module.exports =
  mongoose.model.Facility || mongoose.model("facility", FacilitySchema);
