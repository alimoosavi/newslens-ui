import { useState, useEffect } from "react";

export default function useAuth() {
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem("access_token");
    });

    useEffect(() => {
        setIsAuthenticated(!!user && !!localStorage.getItem("access_token"));
    }, [user]);

    function saveTokens(data) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        // Optionally store user info if provided
        if (data.username && data.user_id) {
            const userInfo = {
                username: data.username,
                user_id: data.user_id,
            };
            localStorage.setItem("user", JSON.stringify(userInfo));
            setUser(userInfo);
        }

        setIsAuthenticated(true);
    }

    function clear() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
    }

    function setUserFromToken(payload) {
        const userInfo = {
            username: payload.username,
            user_id: payload.user_id,
        };
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
        setIsAuthenticated(true);
    }

    return {
        user,
        isAuthenticated,
        setUserFromToken,
        saveTokens,
        clear,
    };
}
