const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
  title: { required: true, type: "string", unique: true },
  content: { required: true, type: "string" },
  image: { required: true, type: "string" },
  date: { type: Date, default: Date.now }, // Add the date attribute with a default value of the current date
});

module.exports =
  mongoose.model.Announcement ||
  mongoose.model("announcement", AnnouncementSchema);
