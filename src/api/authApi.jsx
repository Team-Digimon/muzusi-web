import axios from "axios";
import { baseUrl } from "@/config/Env";

const authApi = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export const reissueAccessToken = async (logout) => {
  try {
    const response = await authApi.get("/auth/reissue");
    if (response.data.code === 200) {
      const { accessToken } = response.data.data;
      sessionStorage.setItem("accessToken", accessToken);
      return accessToken;
    }
    throw new Error("토큰 재발급 오류");
  } catch (error) {
    if (error.response) {
      if (error.reponse.data.code === "0008") {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        logout();
        return null;
      }
      console.error(
        "토큰 재발급 중 예상치 못한 오류",
        error.response.data.message || error.message
      );
    } else {
      console.error("네트워크 또는 서버 오류", error);
    }
    throw error;
  }
};

export const setUpInterceptors = (logout) => {
  authApi.interceptors.request.use(
    (config) => {
      const accessToken = sessionStorage.getItem("accessToken");
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
      if (error.response.data.code === "0004" && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await reissueAccessToken(logout);
          authApi.defaults.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          return authApi(originalRequest);
        } catch (error) {
          console.error("토큰 재발급 실패", error);
          logout();
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default authApi;
