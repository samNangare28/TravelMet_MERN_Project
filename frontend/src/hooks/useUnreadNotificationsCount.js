import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const POLL_INTERVAL_MS = 30000;

/**
 * Polls the unread notification count so any nav element
 * (desktop bell, mobile bottom nav) can show a live badge
 * without each one running its own fetch/parse logic.
 */
function useUnreadNotificationsCount() {

    const [unreadCount, setUnreadCount] = useState(0);

    const refresh = useCallback(async () => {

        const token = localStorage.getItem("token");
        if (!token) return;

        try {

            const response = await api.get("/api/notifications");
            setUnreadCount(response.data.unreadCount || 0);

        } catch (error) {

            // A failed poll shouldn't spam the console every
            // 30s — the bell/bottom nav simply keep the last
            // known count until the next successful poll.

        }

    }, []);

    useEffect(() => {

        refresh();

        const interval = setInterval(refresh, POLL_INTERVAL_MS);

        return () => clearInterval(interval);

    }, [refresh]);

    return unreadCount;

}

export default useUnreadNotificationsCount;
