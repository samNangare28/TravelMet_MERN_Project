const express = require("express");

const router = express.Router();

const tourController =
    require("../controllers/tourController");

const tourBookingController =
    require("../controllers/tourBookingController");

const companyAuth =
    require("../middleware/companyAuth");

const auth =
    require("../middleware/auth");


// =====================================================
// ADD TOUR
// =====================================================
//
// Company only
//
// POST /api/tours
//
// =====================================================

router.post(
    "/",
    companyAuth,
    tourController.addTour
);


// =====================================================
// GET ALL PUBLIC TOURS
// =====================================================
//
// Public
//
// GET /api/tours
//
// Returns only:
// - Active tours
// - Upcoming/non-expired tours
// - Tours having available seats
// - Tours from verified companies
//
// =====================================================

router.get(
    "/",
    tourController.getAllTours
);


// =====================================================
// GET LOGGED-IN COMPANY TOURS
// =====================================================
//
// Company only
//
// GET /api/tours/company/my-tours
//
// =====================================================

router.get(
    "/company/my-tours",
    companyAuth,
    tourController.getCompanyTours
);


// =====================================================
// GET TOUR AVAILABILITY
// =====================================================
//
// Public
//
// GET /api/tours/:tourId/availability
//
// Used by TourDetails.jsx
//
// Returns:
// - maxTravelers
// - bookedTravelers
// - remainingTravelers
// - isFull
//
// =====================================================

router.get(
    "/:tourId/availability",
    tourBookingController.getTourBookingCount
);


// =====================================================
// GET MY TOUR BOOKING
// =====================================================
//
// Logged-in User only
//
// GET /api/tours/:tourId/my-booking
//
// =====================================================

router.get(
    "/:tourId/my-booking",
    auth,
    tourBookingController.getMyTourBooking
);


// =====================================================
// BOOK / REGISTER FOR TOUR
// =====================================================
//
// Logged-in User only
//
// POST /api/tours/:tourId/book
//
// =====================================================

router.post(
    "/:tourId/book",
    auth,
    tourBookingController.bookTour
);


// =====================================================
// CANCEL TOUR BOOKING
// =====================================================
//
// Logged-in User only
//
// DELETE /api/tours/:tourId/book
//
// =====================================================

router.delete(
    "/:tourId/book",
    auth,
    tourBookingController.cancelBooking
);


// =====================================================
// GET TOUR BOOKINGS
// =====================================================
//
// Company only
//
// GET /api/tours/:tourId/bookings
//
// Company can see users registered for its own tour.
//
// =====================================================

router.get(
    "/:tourId/bookings",
    companyAuth,
    tourBookingController.getTourBookings
);


// =====================================================
// GET SINGLE TOUR
// =====================================================
//
// Public
//
// GET /api/tours/:id
//
// IMPORTANT:
// This route is AFTER the specific booking routes.
// Otherwise /availability could be treated as :id.
//
// =====================================================

router.get(
    "/:id",
    tourController.getSingleTour
);


// =====================================================
// UPDATE TOUR
// =====================================================
//
// Company only
//
// PUT /api/tours/:id
//
// =====================================================

router.put(
    "/:id",
    companyAuth,
    tourController.updateTour
);


// =====================================================
// DELETE TOUR
// =====================================================
//
// Company only
//
// DELETE /api/tours/:id
//
// =====================================================

router.delete(
    "/:id",
    companyAuth,
    tourController.deleteTour
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;
