const UserProfile = require("../models/UserProfile");

// ─── GET /api/profile/check ───────────────────────────────────────────────────
// Returns { profileCompleted: true|false }
const checkProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user_id: req.user.id });
    return res.json({ profileCompleted: !!profile });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── GET /api/profile ─────────────────────────────────────────────────────────
// Returns the authenticated user's profile document
const getProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user_id: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── POST /api/profile ────────────────────────────────────────────────────────
// Creates a new profile for the authenticated user.
// Age is auto-calculated inside the model's pre-save hook.
const createProfile = async (req, res) => {
  try {
    const { gender, weight, height, date_of_birth, profile_picture_url } = req.body;

    // Prevent duplicate profiles
    const existing = await UserProfile.findOne({ user_id: req.user.id });
    if (existing) {
      return res.status(409).json({ message: "Profile already exists. Use PUT /api/profile to update." });
    }

    const profile = new UserProfile({
      user_id: req.user.id,
      gender,
      weight,
      height,
      date_of_birth,
      profile_picture_url: profile_picture_url || null,
    });

    await profile.save();
    return res.status(201).json({ message: "Profile created successfully", profile });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─── PUT /api/profile ─────────────────────────────────────────────────────────
// Updates an existing profile (re-calculates age if date_of_birth changes)
const updateProfile = async (req, res) => {
  try {
    const { gender, weight, height, date_of_birth, profile_picture_url } = req.body;

    const profile = await UserProfile.findOne({ user_id: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found. Use POST /api/profile to create one." });
    }

    if (gender !== undefined)             profile.gender = gender;
    if (weight !== undefined)             profile.weight = weight;
    if (height !== undefined)             profile.height = height;
    if (date_of_birth !== undefined)      profile.date_of_birth = date_of_birth;
    if (profile_picture_url !== undefined) profile.profile_picture_url = profile_picture_url;

    // pre-save hook recalculates age and updated_at
    await profile.save();
    return res.json({ message: "Profile updated successfully", profile });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { checkProfile, getProfile, createProfile, updateProfile };