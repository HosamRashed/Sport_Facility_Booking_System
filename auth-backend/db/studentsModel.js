const mongoose = require("mongoose");

// user schema
const StudentSchema = new mongoose.Schema({
  User_ID: {
    type: String,
    required: [true, "Please provide User ID!"],
    unique: [true, "User_ID Exist"],
  },

  User_Email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: [true, "provided email Exist"],
  },

  User_Name: {
    type: String,
    required: [true, "Please provide your name!"],
    unique: false,
  },

  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },

  User_Gender: {
    type: String,
    required: [true, "Please select your gender!"],
  },

  User_status: {
    type: String,
    required: [true],
  },
});

// export UserSchema
module.exports =
  mongoose.model.Students || mongoose.model("students", StudentSchema);
