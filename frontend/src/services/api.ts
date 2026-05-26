import axios from "axios";
import { getAuth } from "./auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
  const s = getAuth();
  if (s.accessToken) config.headers.Authorization = `Bearer ${s.accessToken}`;
  if (s.tenantId) config.headers["X-Tenant-ID"] = s.tenantId;
  return config;
});
