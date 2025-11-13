import { useState, useEffect } from 'react';

export default function useAuth() {
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem('user');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('access_token');
    });

    useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem('access_token'));
    }, [user]);

    function saveTokens(data) {
        localStorage.setItem('access_token', data.access);
        if (data.refresh) {
            localStorage.setItem('refresh_token', data.refresh);
        }
        setIsAuthenticated(true);
    }

    function clear() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    }

    function setUserFromToken(payload) {
        localStorage.setItem('user', JSON.stringify(payload));
        setUser(payload);
    }

    return {
        user,
        isAuthenticated,
        setUserFromToken,
        saveTokens,
        clear,
    };
}
