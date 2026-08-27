const express = require("express");

const router = express.Router();

const tourController =
    require("../controllers/tourController");

const companyAuth =
    require("../middleware/companyAuth");


// =====================================================
// ADD TOUR
// =====================================================
//
// Company only
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
// Used by Explore Tours.
//
// Shows:
// - Active tours
// - Non-expired tours
// - Tours from verified companies
//
// GET /api/tours
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
// GET SINGLE TOUR
// =====================================================
//
// Public
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
// Company only
// Company can update only its own tour.
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
// Company can delete only its own tour.
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
