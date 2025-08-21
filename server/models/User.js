// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true }, // for Google users
  first_name: { type: String },
  last_name: { type: String },
  mobile_number: { type: String },
  email: { type: String, required: true, unique: true },
  city: { type: String },
  password: { type: String }, 
  profile_pic: { type: String },
  user_type: { type: String, default: "user" }
});

module.exports = mongoose.model("User", userSchema);
