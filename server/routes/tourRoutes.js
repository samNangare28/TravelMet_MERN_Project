const express = require("express");

const router = express.Router();

const tourController =
    require("../controllers/tourController");

const tourBookingController =
    require("../controllers/tourBookingController");

const companyAuth =
    require("../middleware/companyAuth");

const { protect: auth } =
    require("../middleware/authMiddleware");


// =====================================================
// DEBUG
// =====================================================

console.log(
    "TOUR BOOKING CONTROLLER:",
    tourBookingController
);


// =====================================================
// ADD TOUR
// =====================================================

router.post(
    "/",
    companyAuth,
    tourController.addTour
);


// =====================================================
// GET ALL PUBLIC TOURS
// =====================================================

router.get(
    "/",
    tourController.getAllTours
);


// =====================================================
// GET COMPANY TOURS
// =====================================================

router.get(
    "/company/my-tours",
    companyAuth,
    tourController.getCompanyTours
);


// =====================================================
// GET TOUR AVAILABILITY
// =====================================================

router.get(
    "/:tourId/booking-count",
    tourBookingController.getTourBookingCount
);


// =====================================================
// GET MY BOOKING
// =====================================================

router.get(
    "/:tourId/my-booking",
    auth,
    tourBookingController.getMyTourBooking
);


// =====================================================
// BOOK TOUR
// =====================================================

router.post(
    "/:tourId/book",
    auth,
    tourBookingController.bookTour
);


// =====================================================
// CANCEL BOOKING
// =====================================================

router.delete(
    "/:tourId/book",
    auth,
    tourBookingController.cancelBooking
);


// =====================================================
// GET TOUR BOOKINGS - COMPANY
// =====================================================

router.get(
    "/:tourId/bookings",
    companyAuth,
    tourBookingController.getTourBookings
);


// =====================================================
// GET SINGLE TOUR
// =====================================================

router.get(
    "/:id",
    tourController.getSingleTour
);


// =====================================================
// UPDATE TOUR
// =====================================================

router.put(
    "/:id",
    companyAuth,
    tourController.updateTour
);


// =====================================================
// DELETE TOUR
// =====================================================

router.delete(
    "/:id",
    companyAuth,
    tourController.deleteTour
);


module.exports = router;