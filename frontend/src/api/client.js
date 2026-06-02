import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json"
  }
});

export function getApiError(error) {
  const detail = error?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => `${item.loc?.slice(1).join(".")}: ${item.msg}`).join(", ");
  }
  return detail || error.message || "Something went wrong";
}

export default api;
