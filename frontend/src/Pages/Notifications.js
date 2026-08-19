import { useState, useEffect } from "react";
import api from "../api/axios";
import NotificationItem from "../components/NotificationItem";
import "../Css/Notifications.css";

function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchNotifications = async () => {

            try {

                setLoading(true);

                const response = await api.get("/api/notifications");

                setNotifications(response.data.notifications);

            } catch (err) {

                console.log("Fetch Notifications Error:", err);

                setError(
                    "Unable to load notifications right now."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchNotifications();

    }, []);

    const handleMarkRead = async (id) => {

        setNotifications((prev) =>
            prev.map((n) =>
                n._id === id ? { ...n, read: true } : n
            )
        );

        try {

            await api.put(`/api/notifications/${id}/read`);

        } catch (err) {

            console.log("Mark Read Error:", err);

        }

    };

    const handleMarkAllRead = async () => {

        setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true }))
        );

        try {

            await api.put("/api/notifications/read-all");

        } catch (err) {

            console.log("Mark All Read Error:", err);

        }

    };

    const unreadCount = notifications.filter(
        (n) => !n.read
    ).length;

    return (

        <div className="notifications-page">

            <div className="notifications-page-header">

                <h2>Notifications</h2>

                {unreadCount > 0 && (
                    <button
                        className="notification-mark-all"
                        onClick={handleMarkAllRead}
                    >
                        Mark all as read
                    </button>
                )}

            </div>

            {loading ? (

                <p className="notification-empty">
                    Loading notifications...
                </p>

            ) : error ? (

                <p className="notification-empty">
                    {error}
                </p>

            ) : notifications.length === 0 ? (

                <p className="notification-empty">
                    No notifications yet.
                </p>

            ) : (

                <div className="notifications-page-list">

                    {notifications.map((n) => (
                        <NotificationItem
                            key={n._id}
                            notification={n}
                            onRead={handleMarkRead}
                        />
                    ))}

                </div>

            )}

        </div>

    );

}

export default Notifications;
