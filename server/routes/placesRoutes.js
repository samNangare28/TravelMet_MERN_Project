const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { getNearbyPlaces } = require("../controllers/placesController");

// Read-only, but tied to the logged-in trip-planning flow —
// kept behind auth for consistency with the rest of the app,
// same posture as the trip routes.
router.get("/nearby", protect, getNearbyPlaces);

module.exports = router;
