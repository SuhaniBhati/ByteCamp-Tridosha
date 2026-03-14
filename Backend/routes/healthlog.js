const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  getHealthLog,
  upsertHealthLog,
  updateApproval,
} = require("../controllers/healthLogController");

// All health-log routes require authentication
router.use(authenticate);

// GET /api/health-log  →  retrieve current user's health log
router.get("/", getHealthLog);

// POST /api/health-log  →  create or overwrite health log + call ML service
router.post("/", upsertHealthLog);

// PATCH /api/health-log/approval  →  doctor updates approval_status / final_medication_time
router.patch("/approval", updateApproval);

module.exports = router;