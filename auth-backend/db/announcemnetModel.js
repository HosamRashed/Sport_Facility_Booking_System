const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
  title: { required: true, type: "string", unique: true },
  content: { required: true, type: "string" },
  image: { required: true, type: "string" },
  date: { type: Date, default: Date.now }, 
});

module.exports =
  mongoose.model.Announcement ||
  mongoose.model("announcement", AnnouncementSchema);
