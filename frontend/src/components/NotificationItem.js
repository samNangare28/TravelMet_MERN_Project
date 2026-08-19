import { useNavigate } from "react-router-dom";

// ================= ICONS PER TYPE =================

const ICONS = {
    follow: "👤",
    follow_request: "➕",
    follow_request_accepted: "✅",
    like: "❤️",
    comment: "💬"
};

function timeAgo(dateString) {

    const seconds = Math.floor(
        (Date.now() - new Date(dateString).getTime()) / 1000
    );

    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return new Date(dateString).toLocaleDateString();

}

function NotificationItem({ notification, onRead }) {

    const navigate = useNavigate();

    const handleClick = () => {

        if (!notification.read) {
            onRead(notification._id);
        }

        // Send the user to the most relevant place.
        if (notification.relatedPost) {
            navigate(`/post/${notification.relatedPost._id}`);
        } else if (notification.sender) {
            navigate(`/profile/${notification.sender._id}`);
        }

    };

    return (

        <div
            className={
                notification.read
                    ? "notification-item"
                    : "notification-item unread"
            }
            data-type={notification.type}
            onClick={handleClick}
        >

            <div className="notification-avatar-wrap">

                <img
                    src={
                        notification.sender?.profileImage ||
                        "https://i.pravatar.cc/100"
                    }
                    alt={notification.sender?.username || "User"}
                    className="notification-avatar"
                />

                <span className="notification-type-icon">
                    {ICONS[notification.type] || "🔔"}
                </span>

            </div>

            <div className="notification-body">

                <p className="notification-message">
                    {notification.message}
                </p>

                <span className="notification-time">
                    {timeAgo(notification.createdAt)}
                </span>

            </div>

            {!notification.read && (
                <span className="notification-dot" />
            )}

        </div>

    );

}

export default NotificationItem;
