import axios from "axios";
import { baseUrl } from "@/config/Env";

const authApi = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export const reissueAccessToken = async () => {
  try {
    const response = await authApi.get("/auth/reissue");
    const { accessToken } = response.data.data;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.error("토큰 재발급 오류", error);
    throw error;
  }
};

authApi.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await reissueAccessToken();
        authApi.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return authApi(originalRequest);
      } catch (error) {
        console.error("토큰 재발급 실패", error);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default authApi;
