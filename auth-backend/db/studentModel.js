const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  User_ID: {
    type: String,
    required: [true, "Please provide User ID!"],
    unique: [true, "User_ID Exist"],
  },

  User_Email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: false,
  },

  Full_Name: {
    type: String,
    required: [true, "Please provide your name!"],
    unique: false,
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
    required: [true, "Please confirm the password!"],
    unique: false,
  },

  User_Gender: {
    type: String,
    required: [true, "Please select your gender!"],
    unique: false,
  },

  User_status: {
    type: String,
    required: [true],
    unique: false,
  },
});

module.exports =
  mongoose.model.Student || mongoose.model("student", StudentSchema);
