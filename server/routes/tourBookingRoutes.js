const express = require("express");

const router = express.Router();

const tourBookingController =
    require("../controllers/tourBookingController");

const authMiddleware =
    require("../middleware/authMiddleware");

const companyAuth =
    require("../middleware/companyAuth");


// =====================================================
// BOOK TOUR
// USER ONLY
// POST /api/tour-bookings/:tourId
// =====================================================

router.post(
    "/:tourId",
    authMiddleware,
    tourBookingController.bookTour
);


// =====================================================
// GET TOUR BOOKING COUNT
// PUBLIC
//
// GET /api/tour-bookings/:tourId/count
//
// Used by:
// - TourDetails
// - ExploreTours
// =====================================================

router.get(
    "/:tourId/count",
    tourBookingController.getTourBookingCount
);


// =====================================================
// GET MY BOOKING
// USER ONLY
//
// GET /api/tour-bookings/:tourId/my-booking
// =====================================================

router.get(
    "/:tourId/my-booking",
    authMiddleware,
    tourBookingController.getMyTourBooking
);


// =====================================================
// CANCEL TOUR BOOKING
// USER ONLY
//
// DELETE /api/tour-bookings/:tourId
// =====================================================

router.delete(
    "/:tourId",
    authMiddleware,
    tourBookingController.cancelBooking
);


// =====================================================
// GET TOUR BOOKINGS
// COMPANY ONLY
//
// GET /api/tour-bookings/company/:tourId
//
// Company can see users registered for its tour.
// =====================================================

router.get(
    "/company/:tourId",
    companyAuth,
    tourBookingController.getTourBookings
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;