const Post = require("../models/Post");
const User = require("../models/User");
const { createNotification } = require("../services/notificationService");

// ================= CREATE POST =================

const createPost = async (req, res) => {

    try {

        const {
            title,
            description,
            image,
            location,
            country,
            category
        } = req.body;

        // The post always belongs to the authenticated
        // user — never to whatever "user" id the client
        // happens to send.
        const user = req.user.id;

        const newPost = new Post({
            user,
            title,
            description,
            image,
            location,
            country,
            category
        });

        await newPost.save();

        res.status(201).json({
            success: true,
            message: "Post Created Successfully",
            post: newPost
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ================= GET ALL POSTS =================


const getAllPosts = async (req, res) => {

    try {

        const posts = await Post.find()

            // Get post owner
            .populate(
                "user",
                "firstName lastName username profileImage privacy"
            )

            .sort({
                createdAt: -1
            });


        // =================================================
        // ONLY PUBLIC USER POSTS
        // =================================================

        const publicPosts = posts.filter(
            post =>
                post.user &&
                post.user.privacy === "public"
        );


        res.status(200).json({

            success: true,

            posts: publicPosts

        });

    }

    catch (error) {

        console.log(
            "Get All Posts Error:",
            error
        );


        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ================= GET USER POSTS =================

const getUserPosts = async (req, res) => {

    try {

        const { id } = req.params;

        const posts = await Post.find({ user: id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            posts
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ================= GET SINGLE POST =================

const getSinglePost = async (req, res) => {

    try {

        const { id } = req.params;

        const post = await Post.findById(id)
            .populate("user", "firstName lastName username profileImage")
            .populate("likes", "firstName lastName username profileImage")
            .populate("comments.user", "firstName lastName username profileImage");

        if (!post) {

            return res.status(404).json({
                success: false,
                message: "Post not found"
            });

        }

        res.status(200).json({
            success: true,
            post
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ================= UPDATE POST =================

const updatePost = async (req, res) => {

    try {

        const { id } = req.params;

        const post = await Post.findById(id);

        if (!post) {

            return res.status(404).json({
                success: false,
                message: "Post not found"
            });

        }

        // Only the post's owner can edit it.
        if (post.user.toString() !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "You can only edit your own posts"
            });

        }

        // Never let the client overwrite ownership via body.
        const { user: _ignoreUser, ...safeUpdates } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            safeUpdates,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Post Updated Successfully",
            post: updatedPost
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// ================= DELETE POST =================

const deletePost = async (req, res) => {

    try {

        const { id } = req.params;

        const post = await Post.findById(id);

        if (!post) {

            return res.status(404).json({
                success: false,
                message: "Post not found"
            });

        }

        // Only the post's owner can delete it.
        if (post.user.toString() !== req.user.id) {

            return res.status(403).json({
                success: false,
                message: "You can only delete your own posts"
            });

        }

        await Post.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Post Deleted Successfully"
        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ================= LIKE / UNLIKE POST =================

const toggleLike = async (req, res) => {

    try {

        const { id } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(id);

        if (!post) {

            return res.status(404).json({
                success: false,
                message: "Post not found"
            });

        }

        const alreadyLiked = post.likes.some(
            (like) => like.toString() === userId
        );

        let justLiked = false;

        if (alreadyLiked) {

            post.likes = post.likes.filter(

                (like) => like.toString() !== userId

            );

        }

        else {

            post.likes.push(userId);
            justLiked = true;

        }

        await post.save();

        // Only notify on a fresh like, never on an unlike.
        if (justLiked) {

            const liker = await User.findById(userId);

            await createNotification({
                recipientId: post.user,
                senderId: userId,
                senderName: liker
                    ? `${liker.firstName} ${liker.lastName}`
                    : "Someone",
                type: "like",
                relatedPost: post._id
            });

        }

        res.status(200).json({

            success: true,
            likes: post.likes,
            totalLikes: post.likes.length

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


// ================= ADD COMMENT =================

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

        const post = await Post.findById(id);

        if (!post) {

            return res.status(404).json({
                success: false,
                message: "Post not found"
            });

        }

        post.comments.push({
            user: userId,
            comment: comment
        });

        await post.save();

        const commenter = await User.findById(userId);

        await createNotification({
            recipientId: post.user,
            senderId: userId,
            senderName: commenter
                ? `${commenter.firstName} ${commenter.lastName}`
                : "Someone",
            type: "comment",
            relatedPost: post._id
        });

        const updatedPost = await Post.findById(id)
            .populate("comments.user", "firstName lastName username profileImage");

        res.status(200).json({

            success: true,
            message: "Comment Added Successfully",
            comments: updatedPost.comments

        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ================= DELETE COMMENT =================

const deleteComment = async (req, res) => {

    try {

        const { postId, commentId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {

            return res.status(404).json({
                success: false,
                message: "Post not found"
            });

        }

        const targetComment = post.comments.find(
            (comment) => comment._id.toString() === commentId
        );

        if (!targetComment) {

            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });

        }

        // Either the comment's author or the post's owner
        // may remove a comment.
        const isCommentAuthor =
            targetComment.user.toString() === req.user.id;

        const isPostOwner =
            post.user.toString() === req.user.id;

        if (!isCommentAuthor && !isPostOwner) {

            return res.status(403).json({
                success: false,
                message: "You cannot delete this comment"
            });

        }

        post.comments = post.comments.filter(

            (comment) => comment._id.toString() !== commentId

        );

        await post.save();

        res.status(200).json({

            success: true,
            message: "Comment Deleted Successfully"

        });

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ================= EXPORTS =================

module.exports = {

    createPost,
    getAllPosts,
    getUserPosts,
    getSinglePost,
    updatePost,
    deletePost,
    toggleLike,
    addComment,
    deleteComment

};