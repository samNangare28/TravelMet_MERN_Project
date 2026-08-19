const express = require("express");

const router = express.Router();

const {
    generateTrip
} = require("../controllers/aiController");

router.post(
    "/generate-trip",
    generateTrip
);

module.exports = router;