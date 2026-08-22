const Blog = require("../models/Blog");
const User = require("../models/User");
const fileToBase64 = require("../utils/fileToBase64");
// A very rough words-per-minute estimate so the create
// form doesn't have to ask the author to guess a number.
const estimateReadTime = (content = "") => {

    const words = content
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

    return Math.max(1, Math.ceil(words / 200));

};


// =====================================================
// CREATE BLOG
// POST /api/blogs
// =====================================================

const createBlog = async (req, res) => {

    try {

        const { title, destination, shortDescription, content, travelTips, category, tags } = req.body;
        const coverImage = req.file ? fileToBase64(req.file) : req.body.coverImage;

        if (!title || !destination || !shortDescription || !content) {

            return res.status(400).json({
                success: false,
                message: "Title, destination, short description and content are required"
            });

        }

        const author = await User.findById(req.user.id);

        const normalizedTags = Array.isArray(tags)
            ? tags
            : typeof tags === "string"
                ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
                : [];

        const newBlog = new Blog({
            // The blog always belongs to the authenticated
            // user — never to whatever id the client sends.
            user: req.user.id,
            title,
            coverImage,
            destination,
            shortDescription,
            content,
            travelTips,
            category,
            tags: normalizedTags,
            authorName: author
                ? `${author.firstName} ${author.lastName}`
                : "Traveller",
            readTime: estimateReadTime(content)
        });

        await newBlog.save();

        res.status(201).json({
            success: true,
            message: "Blog Published Successfully",
            blog: newBlog
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =====================================================
// GET ALL BLOGS
// GET /api/blogs
// Supports optional ?search=&category=&destination= for
// the magazine listing page's filter bar.
// =====================================================

const getAllBlogs = async (req, res) => {

    try {

        const { search, category, destination } = req.query;

        const filter = { published: true };

        if (category && category !== "All") {
            filter.category = category;
        }

        if (destination) {
            filter.destination = new RegExp(destination, "i");
        }

        if (search) {
            filter.$or = [
                { title: new RegExp(search, "i") },
                { destination: new RegExp(search, "i") },
                { tags: new RegExp(search, "i") }
            ];
        }

        const blogs = await Blog.find(filter)
            .populate("user", "firstName lastName username profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            blogs
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =====================================================
// GET SINGLE BLOG
// GET /api/blogs/:id
// =====================================================

const getSingleBlog = async (req, res) => {

    try {

        const { id } = req.params;

        const blog = await Blog.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        )
            .populate("user", "firstName lastName username profileImage bio")
            .populate("likes", "firstName lastName username profileImage")
            .populate("comments.user", "firstName lastName username profileImage");

        if (!blog) {

            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });

        }

        res.status(200).json({
            success: true,
            blog
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =====================================================
// GET BLOGS BY USER
// GET /api/blogs/user/:id
// =====================================================

const getUserBlogs = async (req, res) => {

    try {

        const { id } = req.params;

        const blogs = await Blog.find({ user: id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            blogs
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =====================================================
// UPDATE BLOG
// PUT /api/blogs/:id
// =====================================================

const updateBlog = async (req, res) => {

    try {

        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {

            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });

        }

        // Only the blog's author can edit it.
        if (blog.user.toString() !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "You can only edit your own blogs"
            });

        }

        // Never let the client overwrite ownership via body.
        const { user: _ignoreUser, tags, content, ...safeUpdates } = req.body;
        if (req.file) {
            safeUpdates.coverImage = fileToBase64(req.file);
        }

        if (tags !== undefined) {

            safeUpdates.tags = Array.isArray(tags)
                ? tags
                : String(tags).split(",").map((tag) => tag.trim()).filter(Boolean);

        }

        if (content !== undefined) {

            safeUpdates.content = content;
            safeUpdates.readTime = estimateReadTime(content);

        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            safeUpdates,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Blog Updated Successfully",
            blog: updatedBlog
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =====================================================
// DELETE BLOG
// DELETE /api/blogs/:id
// =====================================================

const deleteBlog = async (req, res) => {

    try {

        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {

            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });

        }

        // Only the blog's author can delete it.
        if (blog.user.toString() !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "You can only delete your own blogs"
            });

        }

        await Blog.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Blog Deleted Successfully"
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =====================================================
// LIKE / UNLIKE BLOG
// PUT /api/blogs/:id/like
// =====================================================

const toggleLike = async (req, res) => {

    try {

        const { id } = req.params;
        const userId = req.user.id;

        const blog = await Blog.findById(id);

        if (!blog) {

            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });

        }

        const alreadyLiked = blog.likes.some(
            (like) => like.toString() === userId
        );

        if (alreadyLiked) {

            blog.likes = blog.likes.filter(
                (like) => like.toString() !== userId
            );

        }

        else {

            blog.likes.push(userId);

        }

        await blog.save();

        res.status(200).json({
            success: true,
            likes: blog.likes,
            totalLikes: blog.likes.length
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =====================================================
// ADD COMMENT
// POST /api/blogs/:id/comment
// =====================================================

const addComment = async (req, res) => {

    try {

        const { id } = req.params;
        const userId = req.user.id;
        const { comment } = req.body;

        if (!comment || !comment.trim()) {

            return res.status(400).json({
                success: false,
                message: "Comment cannot be empty"
            });

        }

        const blog = await Blog.findById(id);

        if (!blog) {

            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });

        }

        blog.comments.push({
            user: userId,
            comment
        });

        await blog.save();

        const updatedBlog = await Blog.findById(id)
            .populate("comments.user", "firstName lastName username profileImage");

        res.status(200).json({
            success: true,
            message: "Comment Added Successfully",
            comments: updatedBlog.comments
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    createBlog,
    getAllBlogs,
    getSingleBlog,
    getUserBlogs,
    updateBlog,
    deleteBlog,
    toggleLike,
    addComment

};
