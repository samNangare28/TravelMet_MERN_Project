const User = require("../models/User");
const Post = require("../models/Post");
const { createNotification } = require("../services/notificationService");
const fileToBase64 = require("../utils/fileToBase64");
const Blog = require("../models/Blog");
const Notification = require("../models/Notification");
// =====================================================
// GET PROFILE
// =====================================================

const getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { viewerId } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Profile ID is required"
            });
        }

        // Find profile user
        const user = await User.findById(id)
            .select("-password")
            .populate(
                "followers",
                "firstName lastName username profileImage"
            )
            .populate(
                "following",
                "firstName lastName username profileImage"
            )
            .populate(
                "followRequests",
                "firstName lastName username profileImage"
            )
            .populate(
                "sentFollowRequests",
                "firstName lastName username profileImage"
            );

        // User does not exist
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // ---------------------------------------------
        // VIEWER ID
        // ---------------------------------------------

        const viewer = viewerId
            ? viewerId.toString()
            : null;

        // ---------------------------------------------
        // OWNER
        // ---------------------------------------------

        const isOwner =
            viewer &&
            user._id.toString() === viewer;

        // ---------------------------------------------
        // FOLLOWING STATUS
        // ---------------------------------------------

        const isFollowing =
            viewer &&
            user.followers.some(
                follower =>
                    follower._id.toString() === viewer
            );

        // ---------------------------------------------
        // FOLLOW REQUEST SENT
        // ---------------------------------------------

        const requestSent =
            viewer &&
            user.followRequests.some(
                requester =>
                    requester._id.toString() === viewer
            );

        // ---------------------------------------------
        // PRIVACY
        // IMPORTANT:
        // Do NOT return 404 for private profiles.
        // Return the profile with private=true.
        // ---------------------------------------------

        const isPrivate =
            user.privacy === "private";

        // ---------------------------------------------
        // POSTS
        // ---------------------------------------------

        let posts = [];

        // Public profile
        // OR owner
        // OR follower
        if (
            !isPrivate ||
            isOwner ||
            isFollowing
        ) {
            posts = await Post.find({
                user: user._id
            }).sort({
                createdAt: -1
            });
        }

        // ---------------------------------------------
        // RESPONSE
        // ---------------------------------------------

        return res.status(200).json({
            success: true,

            private: isPrivate,

            isOwner: !!isOwner,

            following: !!isFollowing,

            requested: !!requestSent,

            user,

            posts
        });

    } catch (error) {

        console.log(
            "Get Profile Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to load profile"
        });
    }
};


// =====================================================
// UPDATE PROFILE
// =====================================================

const updateProfile = async (req, res) => {

    try {

        const { id } = req.params;

        // ---------------------------------------------
        // Only the owner of this profile (proven by the
        // verified JWT) may edit it — not just whoever
        // supplies this id in the URL.
        // ---------------------------------------------

        if (req.user.id !== id) {

            return res.status(403).json({

                success: false,

                message: "You can only edit your own profile"

            });
        }

        const { bio, location, privacy } = req.body;

        const newProfileImage = req.files?.profileImage?.[0]
            ? fileToBase64(req.files.profileImage[0])
            : req.body.profileImage;

        const newCoverImage = req.files?.coverImage?.[0]
            ? fileToBase64(req.files.coverImage[0])
            : req.body.coverImage;

        const user = await User.findByIdAndUpdate(
            id,
            {
                bio,
                location,
                profileImage: newProfileImage,
                coverImage: newCoverImage,
                privacy
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }

        return res.status(200).json({

            success: true,

            message: "Profile Updated Successfully",

            user

        });

    } catch (error) {

        console.log(
            "Update Profile Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


// =====================================================
// FOLLOW USER / SEND FOLLOW REQUEST
// =====================================================

const followUser = async (req, res) => {

    try {

        // The acting user always comes from the verified
        // token, never from the request body — otherwise
        // anyone could make ANY user follow ANY other user.
        const userId = req.user.id;
        const { targetUserId } = req.body;

        // ---------------------------------------------
        // Validation
        // ---------------------------------------------

        if (!userId || !targetUserId) {

            return res.status(400).json({

                success: false,

                message:
                    "User ID and Target User ID are required"

            });
        }

        // ---------------------------------------------
        // Cannot follow yourself
        // ---------------------------------------------

        if (
            userId.toString() ===
            targetUserId.toString()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "You cannot follow yourself"

            });
        }

        // ---------------------------------------------
        // Find users
        // ---------------------------------------------

        const user =
            await User.findById(userId);

        const targetUser =
            await User.findById(targetUserId);

        if (!user || !targetUser) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });
        }

        // ---------------------------------------------
        // Already following
        // ---------------------------------------------

        const alreadyFollowing =
            user.following.some(
                id =>
                    id.toString() ===
                    targetUserId.toString()
            );

        if (alreadyFollowing) {

            return res.status(400).json({

                success: false,

                message:
                    "Already following this user"

            });
        }

        // ---------------------------------------------
        // Already sent request
        // ---------------------------------------------

        const alreadyRequested =
            user.sentFollowRequests.some(
                id =>
                    id.toString() ===
                    targetUserId.toString()
            );

        if (alreadyRequested) {

            return res.status(400).json({

                success: false,

                message:
                    "Follow request already sent"

            });
        }

        // =================================================
        // PRIVATE ACCOUNT
        // =================================================

        if (targetUser.privacy === "private") {

            targetUser.followRequests.push(
                userId
            );

            user.sentFollowRequests.push(
                targetUserId
            );

            await targetUser.save();
            await user.save();

            await createNotification({
                recipientId: targetUserId,
                senderId: userId,
                senderName: `${user.firstName} ${user.lastName}`,
                type: "follow_request"
            });

            return res.status(200).json({

                success: true,

                requested: true,

                following: false,

                message:
                    "Follow request sent"

            });
        }

        // =================================================
        // PUBLIC ACCOUNT
        // =================================================

        user.following.push(
            targetUserId
        );

        targetUser.followers.push(
            userId
        );

        await user.save();
        await targetUser.save();

        await createNotification({
            recipientId: targetUserId,
            senderId: userId,
            senderName: `${user.firstName} ${user.lastName}`,
            type: "follow"
        });

        return res.status(200).json({

            success: true,

            requested: false,

            following: true,

            message:
                "User followed successfully"

        });

    } catch (error) {

        console.log(
            "Follow User Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


// =====================================================
// ACCEPT FOLLOW REQUEST
// =====================================================

const acceptFollowRequest = async (req, res) => {

    try {

        // The acting user (the one accepting/rejecting)
        // always comes from the verified token.
        const userId = req.user.id;
        const { requesterId } = req.body;

        const user =
            await User.findById(userId);

        const requester =
            await User.findById(requesterId);

        if (!user || !requester) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });
        }

        // ---------------------------------------------
        // Check request
        // ---------------------------------------------

        const requestExists =
            user.followRequests.some(
                id =>
                    id.toString() ===
                    requesterId.toString()
            );

        if (!requestExists) {

            return res.status(400).json({

                success: false,

                message:
                    "Follow request not found"

            });
        }

        // ---------------------------------------------
        // Remove request
        // ---------------------------------------------

        user.followRequests =
            user.followRequests.filter(
                id =>
                    id.toString() !==
                    requesterId.toString()
            );

        requester.sentFollowRequests =
            requester.sentFollowRequests.filter(
                id =>
                    id.toString() !==
                    userId.toString()
            );

        // ---------------------------------------------
        // Add follower/following
        // ---------------------------------------------

        if (
            !user.followers.some(
                id =>
                    id.toString() ===
                    requesterId.toString()
            )
        ) {

            user.followers.push(
                requesterId
            );
        }

        if (
            !requester.following.some(
                id =>
                    id.toString() ===
                    userId.toString()
            )
        ) {

            requester.following.push(
                userId
            );
        }

        await user.save();
        await requester.save();

        await createNotification({
            recipientId: requesterId,
            senderId: userId,
            senderName: `${user.firstName} ${user.lastName}`,
            type: "follow_request_accepted"
        });

        return res.status(200).json({

            success: true,

            message:
                "Follow request accepted"

        });

    } catch (error) {

        console.log(
            "Accept Request Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


// =====================================================
// REJECT FOLLOW REQUEST
// =====================================================

const rejectFollowRequest = async (req, res) => {

    try {

        // The acting user (the one accepting/rejecting)
        // always comes from the verified token.
        const userId = req.user.id;
        const { requesterId } = req.body;

        const user =
            await User.findById(userId);

        const requester =
            await User.findById(requesterId);

        if (!user || !requester) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });
        }

        // ---------------------------------------------
        // Remove request
        // ---------------------------------------------

        user.followRequests =
            user.followRequests.filter(
                id =>
                    id.toString() !==
                    requesterId.toString()
            );

        requester.sentFollowRequests =
            requester.sentFollowRequests.filter(
                id =>
                    id.toString() !==
                    userId.toString()
            );

        await user.save();
        await requester.save();

        return res.status(200).json({

            success: true,

            message:
                "Follow request rejected"

        });

    } catch (error) {

        console.log(
            "Reject Request Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


// =====================================================
// UNFOLLOW USER
// =====================================================

const unfollowUser = async (req, res) => {

    try {

        const userId = req.user.id;
        const { targetUserId } = req.body;

        if (!userId || !targetUserId) {

            return res.status(400).json({

                success: false,

                message:
                    "User ID and Target User ID are required"

            });
        }

        const user =
            await User.findById(userId);

        const targetUser =
            await User.findById(targetUserId);

        if (!user || !targetUser) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });
        }

        // ---------------------------------------------
        // Remove following
        // ---------------------------------------------

        user.following =
            user.following.filter(
                id =>
                    id.toString() !==
                    targetUserId.toString()
            );

        // ---------------------------------------------
        // Remove follower
        // ---------------------------------------------

        targetUser.followers =
            targetUser.followers.filter(
                id =>
                    id.toString() !==
                    userId.toString()
            );

        await user.save();
        await targetUser.save();

        return res.status(200).json({

            success: true,

            message:
                "User unfollowed successfully"

        });

    } catch (error) {

        console.log(
            "Unfollow User Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


// =====================================================
// SEARCH USERS
// GET /api/users/search/query?q=sam
// =====================================================

const searchUsers = async (req, res) => {

    try {

        const { q } = req.query;

        if (!q || !q.trim()) {

            return res.status(200).json({
                success: true,
                users: []
            });

        }

        const term = q.trim();

        // Escape regex special characters so a search like
        // "a+b" or "sam." doesn't throw or behave oddly.
        const safeTerm = term.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const regex = new RegExp(safeTerm, "i");

        const users = await User.find({
            $or: [
                { username: regex },
                { firstName: regex },
                { lastName: regex }
            ]
        })
            .select(
                "firstName lastName username profileImage privacy"
            )
            .limit(20);

        return res.status(200).json({
            success: true,
            users
        });

    } catch (error) {

        console.log("Search Users Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to search users"
        });

    }

};

// =====================================================
// DELETE ACCOUNT
// DELETE /api/users/:id
// =====================================================

const deleteAccount = async (req, res) => {

    try {

        const { id } = req.params;

        if (req.user.id !== id) {

            return res.status(403).json({
                success: false,
                message: "You can only delete your own account"
            });

        }

        const user = await User.findById(id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        // या user चे स्वतःचे posts/blogs delete करा
        await Post.deleteMany({ user: id });
        await Blog.deleteMany({ user: id });

        // या user शी संबंधित notifications delete करा
        await Notification.deleteMany({
            $or: [{ recipient: id }, { sender: id }]
        });

        // बाकीच्या users च्या followers/following/likes
        // यादीतून हा user काढून टाका
        await User.updateMany(
            {},
            {
                $pull: {
                    followers: id,
                    following: id,
                    followRequests: id,
                    sentFollowRequests: id
                }
            }
        );

        await Post.updateMany({}, { $pull: { likes: id } });
        await Blog.updateMany({}, { $pull: { likes: id } });

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });

    }

    catch (error) {

        console.log("Delete Account Error:", error);

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

    getProfile,

    updateProfile,

    followUser,

    unfollowUser,

    acceptFollowRequest,

    rejectFollowRequest,

    searchUsers,
    
    deleteAccount

};