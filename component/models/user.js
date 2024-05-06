const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required!",
    },
    email: {
      type: String,
      required: "Email is required!",
    },
    createdAt: {
        type: Date,
        default: Date.now
      },
}
);

module.exports = mongoose.model("User", userSchema);