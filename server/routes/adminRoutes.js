const express = require("express");

const router =
    express.Router();

const adminController =
    require("../controllers/adminController");

const adminAuth =
    require("../middleware/adminAuth");

const { authLimiter } =
    require("../middleware/rateLimiter");


// ADMIN LOGIN

router.post(
    "/login",
    authLimiter,
    adminController.loginAdmin
);


// ADMIN AUTH TEST

router.get(
    "/test",
    adminAuth,
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Admin authentication working ✅",

            admin:
                req.admin

        });

    }
);


module.exports = router;