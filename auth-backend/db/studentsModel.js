const mongoose = require("mongoose");

// user schema
const StudentSchema = new mongoose.Schema({
  User_ID: {
    type: String,
    required: [true, "Please provide User ID!"],
    unique: [true, "User_ID Exist"],
  },

  Full_Name: {
    type: String,
    required: [true, "Please provide your name!"],
  },

  SecretQuestion: {
    type: String,
    required: [true, "Please choose a secret question!"],
    unique: false,
  },

  AnswerQuestion: {
    type: String,
    required: [true, "Please answer the secret question!"],
    unique: false,
  },

  Password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },

  ConfirmPassword: {
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
