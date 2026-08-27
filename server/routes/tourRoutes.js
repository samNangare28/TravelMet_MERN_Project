const express = require("express");

const router =
    express.Router();

const tourController =
    require("../controllers/tourController");

const companyAuth =
    require("../middleware/companyAuth");


// =====================================================
// ADD TOUR
// =====================================================

router.post(
    "/",
    companyAuth,
    tourController.addTour
);


// =====================================================
// GET LOGGED-IN COMPANY TOURS
// =====================================================

router.get(
    "/company/my-tours",
    companyAuth,
    tourController.getCompanyTours
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


module.exports =
    router;
