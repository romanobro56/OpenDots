// API Configuration for OpenDots
// Change BASE_URL to point to your Python backend (Flask/FastAPI)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const API = {
  waitlist: `${BASE_URL}/api/waitlist`,
  convert: `${BASE_URL}/api/convert`,
};

// POST /api/waitlist
// Body: { first_name: string, email: string, role: string }
// Response: { success: boolean }
export interface WaitlistPayload {
  first_name: string;
  email: string;
  role: string;
}
export interface WaitlistResponse {
  success: boolean;
}

// POST /api/convert
// Body: FormData with image file
// Response: { grid: number[][] } — 8x12 array of 0s and 1s
export interface ConvertResponse {
  grid: number[][];
}

// Python backend (Flask or FastAPI) is responsible for handling CORS.
// Both endpoints should return standard HTTP status codes and handle errors gracefully.
