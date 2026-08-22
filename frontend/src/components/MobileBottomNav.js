import { Link, useLocation } from "react-router-dom";
import useUnreadNotificationsCount from "../hooks/useUnreadNotificationsCount";
import "../Css/MobileBottomNav.css";

const NAV_ITEMS = [
    {
        to: "/community",
        label: "Community",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9.5 12 3l9 6.5" />
                <path d="M5 10v10h14V10" />
            </svg>
        )
    },
    {
        to: "/blogs",
        label: "Blog",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
            </svg>
        )
    },
    {
        to: "/trip-planner",
        label: "AI Trip",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
                <circle cx="12" cy="12" r="3.5" />
            </svg>
        )
    },
    {
        to: "/search",
        label: "Search",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        )
    },
    {
        to: "/notifications",
        label: "Alerts",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
        ),
        showBadge: true
    },
    {
        to: "/profile",
        label: "Profile",
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
            </svg>
        )
    }
];

function MobileBottomNav() {

    const location = useLocation();
    const token = localStorage.getItem("token");
    const unreadCount = useUnreadNotificationsCount();

    // Bottom nav is a logged-in, mobile-only experience — the
    // existing top navbar already handles the logged-out state.
    if (!token) return null;

    return (

        <nav className="mobile-bottom-nav">

            {NAV_ITEMS.map((item) => {

                const isActive =
                    location.pathname === item.to ||
                    (item.to !== "/" &&
                        location.pathname.startsWith(item.to));

                return (

                    <Link
                        key={item.to}
                        to={item.to}
                        className={
                            isActive
                                ? "mobile-nav-item active"
                                : "mobile-nav-item"
                        }
                    >

                        <span className="mobile-nav-icon-wrap">

                            {item.icon}

                            {item.showBadge && unreadCount > 0 && (
                                <span className="mobile-nav-badge">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}

                        </span>

                        <span className="mobile-nav-label">
                            {item.label}
                        </span>

                    </Link>

                );

            })}

        </nav>

    );

}

export default MobileBottomNav;
