import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080",
  withCredentials: true,
});

export default apiClient;
