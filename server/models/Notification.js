const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        // Who this notification is for.
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Who triggered it.
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: [
                "follow",
                "follow_request",
                "follow_request_accepted",
                "like",
                "comment"
            ],
            required: true
        },

        message: {
            type: String,
            required: true
        },

        relatedPost: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: null
        },

        // Kept distinct from `sender` so the frontend has an
        // explicit target to link to (currently always the
        // sender, but keeps the schema self-explanatory and
        // future-proof if that ever changes).
        relatedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        read: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Newest-first is by far the most common query pattern.
notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
