const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
    createBlog,
    getAllBlogs,
    getSingleBlog,
    getUserBlogs,
    updateBlog,
    deleteBlog,
    toggleLike,
    addComment
} = require("../controllers/blogController");




router.get("/", getAllBlogs);


// =====================================================
// GET BLOGS BY USER
// GET /api/blogs/user/:id
// =====================================================

router.get("/user/:id", getUserBlogs);


// =====================================================
// GET SINGLE BLOG
// GET /api/blogs/:id
// =====================================================

router.get("/:id", getSingleBlog);


router.post("/", protect, upload.single("coverImage"), createBlog);
router.put("/:id", protect, upload.single("coverImage"), updateBlog);


// =====================================================
// LIKE / UNLIKE BLOG
// PUT /api/blogs/:id/like
// =====================================================

router.put("/:id/like", protect, toggleLike);


// =====================================================
// ADD COMMENT
// POST /api/blogs/:id/comment
// =====================================================

router.post("/:id/comment", protect, addComment);


// =====================================================
// DELETE BLOG
// DELETE /api/blogs/:id
// =====================================================

router.delete("/:id", protect, deleteBlog);


module.exports = router;
