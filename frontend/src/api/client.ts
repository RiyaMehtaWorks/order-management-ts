import axios from "axios";

// Single axios instance the whole app shares. Base URL comes from
// VITE_API_URL (see .env.example) so switching backend hosts (e.g. after
// deploying to Render/Railway) is a one-line env var change.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001",
  headers: { "Content-Type": "application/json" },
});

// Unwraps the backend's `{ error: { message } }` shape into a plain Error
// so components/hooks can just read `err.message`.
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.error?.message ||
      err.message ||
      "Something went wrong.";
    return Promise.reject(new Error(message));
  },
);
