import axios, { type AxiosInstance } from "axios";
import { API_BASE_URL } from "@/infrastructure/config/env";
import { localTokenStorage } from "@/infrastructure/storage/LocalTokenStorage";
import { localSessionStorage } from "@/infrastructure/storage/LocalSessionStorage";
import { mapApiError } from "./errors";

const LOGIN_PATH = "/login";
const PUBLIC_PATHS = ["/login", "/register"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  const token = localTokenStorage.get();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localTokenStorage.clear();
      localSessionStorage.clear();
      if (typeof window !== "undefined" && !isPublicPath(window.location.pathname)) {
        window.location.href = LOGIN_PATH;
      }
    }
    return Promise.reject(mapApiError(error));
  },
);
