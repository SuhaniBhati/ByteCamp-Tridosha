const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  checkProfile,
  getProfile,
  createProfile,
  updateProfile,
} = require("../controllers/profileController");

// All profile routes require a valid JWT cookie
router.use(authenticate);

// GET /api/profile/check  →  { profileCompleted: true|false }
router.get("/check", checkProfile);

// GET /api/profile  →  full profile document
router.get("/", getProfile);

// POST /api/profile  →  create profile (first-time onboarding)
router.post("/", createProfile);

// PUT /api/profile  →  update existing profile
router.put("/", updateProfile);

module.exports = router;