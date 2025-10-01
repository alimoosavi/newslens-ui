import axios from "axios";

// Create axios instance
const api = axios.create({
    baseURL: "http://127.0.0.1:8000", // Your Django backend
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor to include JWT from localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
