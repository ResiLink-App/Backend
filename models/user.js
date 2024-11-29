const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    whatsapp: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    dateOfBirth: {
      type: Date,
    },
    profilePic: {
      type: String,
      required: true,
      default:
        "https://themedox.com/mykd/wp-content/uploads/2023/10/team02.png",
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
