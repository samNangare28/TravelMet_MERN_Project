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
//
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
// GET COMPANY PENDING BOOKINGS
// COMPANY ONLY
//
// GET /api/tour-bookings/company/pending
//
// Company dashboard साठी.
// =====================================================

router.get(
    "/company/pending",
    companyAuth,
    tourBookingController.getCompanyPendingBookings
);


// =====================================================
// GET TOUR BOOKINGS
// COMPANY ONLY
//
// GET /api/tour-bookings/company/:tourId
//
// Company आपल्या specific tour च्या bookings पाहू शकते.
// =====================================================

router.get(
    "/company/:tourId",
    companyAuth,
    tourBookingController.getTourBookings
);


// =====================================================
// ACCEPT BOOKING
// COMPANY ONLY
//
// PATCH /api/tour-bookings/company/:bookingId/accept
//
// Company booking accept केल्यावर:
// pending → confirmed
// आणि मग user ला confirmation email.
// =====================================================

router.patch(
    "/company/:bookingId/accept",
    companyAuth,
    tourBookingController.acceptBooking
);


// =====================================================
// REJECT BOOKING
// COMPANY ONLY
//
// PATCH /api/tour-bookings/company/:bookingId/reject
//
// Company booking reject केल्यावर:
// pending → rejected
// आणि user ला rejection email.
// =====================================================

router.patch(
    "/company/:bookingId/reject",
    companyAuth,
    tourBookingController.rejectBooking
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;