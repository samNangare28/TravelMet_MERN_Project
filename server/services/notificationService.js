const Notification = require("../models/Notification");

// =====================================================
// Central place that builds the message text per type so
// every controller that triggers a notification doesn't
// have to duplicate the wording.
// =====================================================

const MESSAGE_BUILDERS = {
    follow: (senderName) =>
        `${senderName} started following you.`,

    follow_request: (senderName) =>
        `${senderName} sent you a follow request.`,

    follow_request_accepted: (senderName) =>
        `${senderName} accepted your follow request.`,

    like: (senderName) =>
        `${senderName} liked your post.`,

    comment: (senderName) =>
        `${senderName} commented on your post.`
};

/**
 * Creates a notification, unless the recipient and sender
 * are the same person (nobody needs to be told they liked
 * their own post) — every call site can call this
 * unconditionally instead of remembering that check.
 */
const createNotification = async ({
    recipientId,
    senderId,
    senderName,
    type,
    relatedPost = null
}) => {
    try {
        if (!recipientId || !senderId) return null;

        if (recipientId.toString() === senderId.toString()) {
            return null;
        }

        const buildMessage = MESSAGE_BUILDERS[type];

        if (!buildMessage) {
            console.log("Unknown notification type:", type);
            return null;
        }

        const notification = await Notification.create({
            recipient: recipientId,
            sender: senderId,
            type,
            message: buildMessage(senderName),
            relatedPost,
            relatedUser: senderId
        });

        return notification;
    } catch (error) {
        // A failed notification should never break the
        // action that triggered it (a like, a comment, a
        // follow) — log it and move on.
        console.log("Create Notification Error:", error);
        return null;
    }
};

module.exports = { createNotification };
