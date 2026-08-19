const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    getProfile,
    updateProfile,
    followUser,
    unfollowUser,
    acceptFollowRequest,
    rejectFollowRequest,
    searchUsers
} = require("../controllers/userController");


// =====================================================
// SEARCH
// This must come before "/:id" or Express would treat
// "search" as a profile id and never reach this handler.
// =====================================================

router.get("/search/query", searchUsers);


// =====================================================
// PROFILE
// =====================================================

router.get("/:id", getProfile);

router.put("/:id", protect, updateProfile);


// =====================================================
// FOLLOW
// =====================================================

router.post("/follow", protect, followUser);

router.post("/unfollow", protect, unfollowUser);


// =====================================================
// FOLLOW REQUEST
// =====================================================

router.post(
    "/follow-request/accept",
    protect,
    acceptFollowRequest
);

router.post(
    "/follow-request/reject",
    protect,
    rejectFollowRequest
);


module.exports = router;
