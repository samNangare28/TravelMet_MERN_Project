const express = require("express");

const router = express.Router();


// =====================================================
// CONTROLLERS
// =====================================================

const tourController =
    require("../controllers/tourController");


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
// GET SINGLE TOUR
// =====================================================
//
// IMPORTANT:
// This route is kept AFTER the more specific routes
// above so that:
//
// /company/my-tours
//
// is matched correctly first.
//
// Booking-related routes (booking-count, my-booking,
// book, cancel, bookings-for-tour, confirm, reject,
// pending) all now live under /api/tour-bookings —
// see routes/tourBookingRoutes.js.
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
