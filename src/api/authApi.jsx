import axios from "axios";
import { baseUrl } from "@/config/Env";

const authApi = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("인증 오류: 토큰이 유효하지 않거나 만료되었습니다.");
    }
    return Promise.reject(error);
  }
);

export default authApi;
