const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "user must have username"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "user must have password"],
  },
});

const User = model("User", userSchema);

module.exports = User;
