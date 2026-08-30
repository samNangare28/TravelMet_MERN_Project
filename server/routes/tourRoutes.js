const express = require("express");

const router = express.Router();


// =====================================================
// CONTROLLERS
// =====================================================

const tourController =
    require("../controllers/tourController");

const tourBookingController =
    require("../controllers/tourBookingController");


// =====================================================
// MIDDLEWARE
// =====================================================

const companyAuth =
    require("../middleware/companyAuth");

const {
    protect: auth
} = require("../middleware/authMiddleware");


// =====================================================
// ADD TOUR
// =====================================================
//
// Only authenticated companies can create tours.
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
// Public route.
// No login required.
//
// GET /api/tours
//
// =====================================================

router.get(

    "/",

    tourController.getAllTours

);


// =====================================================
// GET COMPANY TOURS
// =====================================================
//
// Returns tours created by logged-in company.
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
// Public route.
//
// Used by TourDetails to display:
//
// - maximum travelers
// - booked travelers
// - remaining seats
// - full status
//
// GET /api/tours/:tourId/booking-count
//
// =====================================================

router.get(

    "/:tourId/booking-count",

    tourBookingController.getTourBookingCount

);


// =====================================================
// GET MY BOOKING
// =====================================================
//
// Logged-in user only.
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
// BOOK TOUR
// =====================================================
//
// Logged-in user only.
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
// Logged-in user only.
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
// GET TOUR BOOKINGS - COMPANY
// =====================================================
//
// Only the company that owns the tour should be able
// to view its bookings.
//
// GET /api/tours/:tourId/bookings
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
// IMPORTANT:
// This route is kept AFTER the more specific routes
// above so that:
//
// /company/my-tours
// /:tourId/booking-count
// /:tourId/my-booking
// /:tourId/book
// /:tourId/bookings
//
// are matched correctly.
//
// GET /api/tours/:id
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
// Only the owning company should be allowed to update
// the tour.
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
// Only the owning company can delete the tour.
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
// EXPORT ROUTER
// =====================================================

module.exports = router;
