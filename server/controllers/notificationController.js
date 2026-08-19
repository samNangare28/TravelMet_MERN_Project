const Notification = require("../models/Notification");

// =====================================================
// GET NOTIFICATIONS
// GET /api/notifications
// (recipient always comes from the verified token)
// =====================================================

const getNotifications = async (req, res) => {
    try {
        const recipientId = req.user.id;

        const notifications = await Notification.find({
            recipient: recipientId
        })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate(
                "sender",
                "firstName lastName username profileImage"
            )
            .populate("relatedPost", "title image");

        const unreadCount = await Notification.countDocuments({
            recipient: recipientId,
            read: false
        });

        return res.status(200).json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        console.log("Get Notifications Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load notifications"
        });
    }
};

// =====================================================
// MARK ONE AS READ
// PUT /api/notifications/:id/read
// =====================================================

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const recipientId = req.user.id;

        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        // A user can only mark their own notifications as read.
        if (notification.recipient.toString() !== recipientId) {
            return res.status(403).json({
                success: false,
                message: "You cannot modify this notification"
            });
        }

        notification.read = true;
        await notification.save();

        return res.status(200).json({
            success: true,
            notification
        });
    } catch (error) {
        console.log("Mark Notification Read Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =====================================================
// MARK ALL AS READ
// PUT /api/notifications/read-all
// =====================================================

const markAllAsRead = async (req, res) => {
    try {
        const recipientId = req.user.id;

        await Notification.updateMany(
            { recipient: recipientId, read: false },
            { $set: { read: true } }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (error) {
        console.log("Mark All Read Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead
};
