const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    profile_picture_url: {
      type: String,
      default: null,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    height: {
      type: Number,
      required: true,
    },

    date_of_birth: {
      type: Date,
      required: true,
    },

    age: {
      type: Number,
    },

    created_at: {
      type: Date,
      default: Date.now,
    },

    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "user_profiles" }
);

// Auto-calculate age from date_of_birth before saving
userProfileSchema.pre("save", function (next) {
  if (this.date_of_birth) {
    const today = new Date();
    const dob = new Date(this.date_of_birth);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    this.age = age;
  }
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model("UserProfile", userProfileSchema);