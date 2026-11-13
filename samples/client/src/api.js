// API base URL — set via REACT_APP_API_BASE_URL in .env (baked in at CRA build/start time).
//
// Local dev:   http://localhost:4000/samples/api   (shared-server)
// Production:  update REACT_APP_API_BASE_URL to the deployed shared-server URL
//              e.g. https://your-shared-server.onrender.com/samples/api
const PRODUCTION_API_BASE_URL =
  "https://programmoceuticals-samples-server.vercel.app/api";

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || PRODUCTION_API_BASE_URL;

export async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch (error) {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }

  return payload;
}
