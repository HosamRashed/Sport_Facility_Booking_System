const mongoose = require("mongoose");

// user schema
const UserSchema = new mongoose.Schema({
  User_ID: {
    type: String,
    required: [true, "Please provide User ID!"],
    unique: [true, "User_ID Exist"],
  },

  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },
});

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
