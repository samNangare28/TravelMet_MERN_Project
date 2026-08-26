const express = require("express");

const router = express.Router();

const adminController =
    require("../controllers/adminController");

const { authLimiter } =
    require("../middleware/rateLimiter");


router.post(
    "/login",
    authLimiter,
    adminController.loginAdmin
);


module.exports = router;