const HealthLog = require("../models/HealthLog");
const axios = require("axios");

// ─── GET /api/health-log ──────────────────────────────────────────────────────
// Returns the authenticated user's health log (for pre-filling dashboard form)
const getHealthLog = async (req, res) => {
  try {
    const log = await HealthLog.findOne({ user_id: req.user.id });
    if (!log) {
      return res.status(404).json({ message: "No health log found for this user" });
    }
    return res.json(log);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── POST /api/health-log ─────────────────────────────────────────────────────
// Creates or fully overwrites the user's health log.
// Also calls the ML prediction service and stores results.
const upsertHealthLog = async (req, res) => {
  try {
    const {
      medical_data,   // { sleep_duration, heart_rate, stress, glucose, cholesterol }
      condition,      // { condition_id, condition_name }
      medication,     // { drug_id, dosage, duration_days, doctor_prescribed_time }
    } = req.body;

    // ── Call ML prediction service ──────────────────────────────────────────
    let ai_recommended_time = null;
    let predicted_improvement_score = null;

    try {
      const mlResponse = await axios.post(
        process.env.ML_SERVICE_URL || "http://localhost:8001/predict",
        {
          medical_data,
          condition,
          medication,
        }
      );

      ai_recommended_time       = mlResponse.data.recommended_medication_hour ?? null;
      predicted_improvement_score = mlResponse.data.predicted_improvement_score ?? null;
    } catch (mlErr) {
      // ML service unavailable — store null values, do not block the save
      console.warn("ML prediction service unavailable:", mlErr.message);
    }

    // ── Build the payload ───────────────────────────────────────────────────
    const logPayload = {
      medical_data: {
        sleep_duration: medical_data?.sleep_duration ?? null,
        heart_rate:     medical_data?.heart_rate     ?? null,
        stress:         medical_data?.stress         ?? null,
        glucose:        medical_data?.glucose        ?? null,
        cholesterol:    medical_data?.cholesterol    ?? null,
      },

      condition: {
        condition_id:   condition?.condition_id   ?? null,
        condition_name: condition?.condition_name ?? null,
      },

      medication: {
        drug_id:       medication?.drug_id       ?? null,
        dosage:        medication?.dosage        ?? null,
        duration_days: medication?.duration_days ?? null,

        doctor_prescribed_time: medication?.doctor_prescribed_time ?? null,

        ai_recommended_time,
        // final_medication_time defaults to ai_recommended_time until a doctor overrides it
        final_medication_time: ai_recommended_time,

        approval_status: "pending",
      },

      model_output: {
        predicted_improvement_score,
      },

      updated_at: new Date(),
    };

    // ── Upsert: update existing doc or create new one ───────────────────────
    const log = await HealthLog.findOneAndUpdate(
      { user_id: req.user.id },
      { $set: { user_id: req.user.id, ...logPayload } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json({
      message: "Health log saved successfully",
      log,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── PATCH /api/health-log/approval ──────────────────────────────────────────
// Doctor endpoint: update approval_status and final_medication_time
const updateApproval = async (req, res) => {
  try {
    const { user_id, approval_status, final_medication_time } = req.body;

    if (!["approved", "rejected"].includes(approval_status)) {
      return res.status(400).json({ message: "approval_status must be 'approved' or 'rejected'" });
    }

    const log = await HealthLog.findOneAndUpdate(
      { user_id },
      {
        $set: {
          "medication.approval_status":    approval_status,
          "medication.final_medication_time": final_medication_time ?? undefined,
          updated_at: new Date(),
        },
      },
      { new: true }
    );

    if (!log) {
      return res.status(404).json({ message: "Health log not found for this user" });
    }

    return res.json({ message: "Approval updated", log });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getHealthLog, upsertHealthLog, updateApproval };