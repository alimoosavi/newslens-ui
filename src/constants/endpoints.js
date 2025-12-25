// API Endpoint Constants
export const API_ENDPOINTS = {
    // Session Management
    SESSIONS: '/api/sessions/',
    SESSION_DETAIL: (id) => `/api/sessions/${id}/`,
    SESSION_MESSAGES: (id) => `/api/sessions/${id}/messages/`,
    SESSION_CHAT: (id) => `/api/sessions/${id}/chat/`,
    SESSION_CLEAR: (id) => `/api/sessions/${id}/clear/`,

    // Search
    SEARCH: '/api/search/',
    SEARCH_CLICK: '/api/search/click/',

    // Auth
    AUTH_REGISTER: '/auth/register/',     // ← NEW ENDPOINT
    AUTH_TOKEN: '/auth/token/',
    AUTH_REFRESH: '/auth/token/refresh/',
};

export default API_ENDPOINTS;