const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    getNotifications,
    markAsRead,
    markAllAsRead
} = require("../controllers/notificationController");

// Every notification route is scoped to the logged-in
// user (never a param'd id), so all of them require auth.

router.get("/", protect, getNotifications);

router.put("/read-all", protect, markAllAsRead);

router.put("/:id/read", protect, markAsRead);

module.exports = router;
