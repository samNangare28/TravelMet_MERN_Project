import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import NotificationItem from "./NotificationItem";
import "../Css/Notifications.css";

// Polling instead of websockets keeps this in step with the
// rest of the project's stack (no socket.io elsewhere) while
// still feeling reasonably live.
const POLL_INTERVAL_MS = 30000;

function NotificationBell() {

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = useCallback(async () => {

        try {

            const response = await api.get("/api/notifications");

            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);

        } catch (error) {

            console.log("Fetch Notifications Error:", error);

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        fetchNotifications();

        const interval = setInterval(
            fetchNotifications,
            POLL_INTERVAL_MS
        );

        return () => clearInterval(interval);

    }, [fetchNotifications]);

    // Close the dropdown on outside click.
    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setOpen(false);
            }

        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

    }, []);

    const handleMarkRead = async (id) => {

        setNotifications((prev) =>
            prev.map((n) =>
                n._id === id ? { ...n, read: true } : n
            )
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));

        try {

            await api.put(`/api/notifications/${id}/read`);

        } catch (error) {

            console.log("Mark Read Error:", error);

        }

    };

    const handleMarkAllRead = async () => {

        setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true }))
        );

        setUnreadCount(0);

        try {

            await api.put("/api/notifications/read-all");

        } catch (error) {

            console.log("Mark All Read Error:", error);

        }

    };

    return (

        <div className="notification-bell-wrap" ref={wrapperRef}>

            <button
                className="notification-bell-btn"
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Notifications"
            >

                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>

                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}

            </button>

            {open && (

                <div className="notification-dropdown">

                    <div className="notification-dropdown-header">

                        <h4>Notifications</h4>

                        {unreadCount > 0 && (
                            <button
                                className="notification-mark-all"
                                onClick={handleMarkAllRead}
                            >
                                Mark all as read
                            </button>
                        )}

                    </div>

                    <div className="notification-dropdown-list">

                        {loading ? (

                            <p className="notification-empty">
                                Loading notifications...
                            </p>

                        ) : notifications.length === 0 ? (

                            <p className="notification-empty">
                                No notifications yet.
                            </p>

                        ) : (

                            notifications.slice(0, 6).map((n) => (
                                <NotificationItem
                                    key={n._id}
                                    notification={n}
                                    onRead={handleMarkRead}
                                />
                            ))

                        )}

                    </div>

                    {notifications.length > 0 && (

                        <button
                            className="notification-see-all"
                            onClick={() => {
                                setOpen(false);
                                navigate("/notifications");
                            }}
                        >
                            See all notifications
                        </button>

                    )}

                </div>

            )}

        </div>

    );

}

export default NotificationBell;
