import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: apiUrl,
  // timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    // Accept: "application/json",
  },
});
