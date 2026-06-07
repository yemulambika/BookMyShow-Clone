// API base URL. Override per-environment with a VITE_API_BASE_URL env var
// (e.g. http://localhost:8001 for local dev). Falls back to the deployed API.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://bookmyshow-clone-em6p.onrender.com";
