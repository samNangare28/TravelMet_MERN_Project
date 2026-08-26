const express = require("express");

const router = express.Router();

const companyAuthController =
    require("../controllers/companyAuthController");

const { authLimiter } =
    require("../middleware/rateLimiter");


// Company Registration
router.post(
    "/register",
    authLimiter,
    companyAuthController.registerCompany
);


// Company Login
router.post(
    "/login",
    authLimiter,
    companyAuthController.loginCompany
);


module.exports = router;