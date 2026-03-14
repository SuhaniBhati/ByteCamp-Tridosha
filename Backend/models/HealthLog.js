const mongoose = require("mongoose");

const healthLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one active log per user
    },

    medical_data: {
      sleep_duration: { type: Number, default: null },
      heart_rate:     { type: Number, default: null },
      stress:         { type: Number, default: null },
      glucose:        { type: Number, default: null },
      cholesterol:    { type: Number, default: null },
    },

    condition: {
      condition_id:   { type: Number, default: null },
      condition_name: { type: String, default: null },
    },

    medication: {
      drug_id:      { type: Number, default: null },
      dosage:       { type: Number, default: null },
      duration_days:{ type: Number, default: null },

      doctor_prescribed_time: { type: Number, default: null },

      ai_recommended_time:  { type: Number, default: null },
      final_medication_time:{ type: Number, default: null },

      approval_status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
    },

    model_output: {
      predicted_improvement_score: { type: Number, default: null },
    },

    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "health_logs" }
);

module.exports = mongoose.model("HealthLog", healthLogSchema);