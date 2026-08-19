const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createTrip,
    getUserTrips,
    getTripById,
    deleteTrip,
    geocodePreview
} = require("../controllers/tripController");


// =====================================================
// CREATE TRIP
// POST /api/trips
// =====================================================

router.post(
    "/",
    protect,
    createTrip
);


// =====================================================
// GEOCODE PREVIEW (must come before "/:id")
// POST /api/trips/geocode-preview
// =====================================================

router.post(
    "/geocode-preview",
    protect,
    geocodePreview
);


// =====================================================
// GET ALL USER TRIPS
// GET /api/trips/user/:id
// =====================================================

router.get(
    "/user/:id",
    getUserTrips
);


// =====================================================
// GET SINGLE TRIP
// GET /api/trips/:id
// =====================================================

router.get(
    "/:id",
    getTripById
);


// =====================================================
// DELETE TRIP
// DELETE /api/trips/:id
// =====================================================

router.delete(
    "/:id",
    protect,
    deleteTrip
);


module.exports = router;
