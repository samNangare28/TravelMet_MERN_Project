import axios from "axios";

// Central axios instance.
// - baseURL comes from an env var so it's not hardcoded
//   per-file (and can point at a real server in production).
// - The request interceptor automatically attaches the
//   JWT saved at login, so every authenticated backend
//   route (follow/unfollow, like, comment, create/edit/
//   delete post, trips, profile edit) works without each
//   page having to remember to add the header itself.

const api = axios.create({
    baseURL:
        process.env.REACT_APP_API_URL ||
        "http://localhost:5000"
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
