const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
    createPost,
    getAllPosts,
    getUserPosts,
    getSinglePost,
    updatePost,
    deletePost,
    toggleLike,
    addComment,
    deleteComment
} = require("../controllers/postController");


router.post("/", protect, upload.single("image"), createPost);
router.put("/:id", protect, upload.single("image"), updatePost);

router.get("/", getAllPosts);

router.get("/user/:id", getUserPosts);

router.get("/:id", getSinglePost);



router.put("/:id/like", protect, toggleLike);

router.post("/:id/comment", protect, addComment);

router.delete("/:postId/comment/:commentId", protect, deleteComment);

router.delete("/:id", protect, deletePost);

module.exports = router;
