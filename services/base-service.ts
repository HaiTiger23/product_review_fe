import axios, { AxiosError } from "axios";

export const BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: import("axios").InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const user: any = localStorage.getItem("user");
      const token = user ? JSON.parse(user).token : null;
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);

export default api;

// Example usage:

/*
export interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (credentials: LoginPayload) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    throw error;
  }
};
*/
