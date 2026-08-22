const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimiter");

router.post("/register", authLimiter, authController.registerUser);
router.post("/login", authLimiter, authController.loginUser);

module.exports = router;