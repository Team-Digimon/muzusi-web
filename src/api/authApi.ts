import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { baseUrl } from "@/config/Env";
import noAuthapi from "./noAuthApi";
import type { ApiEnvelope, ApiErrorPayload } from "@/types/api";
import type { ReissueTokenData } from "@/types/auth";

// 재발급 실패 후 재시도 여부를 표시하기 위해 axios 기본 config에 필드를 하나 확장
interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const authApi: AxiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

const reissueAccessToken = async (
  logout: () => void
): Promise<string | null> => {
  try {
    const response = await noAuthapi.get<ApiEnvelope<ReissueTokenData>>(
      "/auth/reissue"
    );
    if (response.data.code === 200) {
      const { accessToken } = response.data.data;
      sessionStorage.setItem("accessToken", accessToken);
      return accessToken;
    }
    throw new Error("토큰 재발급 오류");
  } catch (error) {
    if (axios.isAxiosError<ApiErrorPayload>(error)) {
      if (error.response) {
        if (error.response.data.code === "0008") {
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
    } else {
      console.error("네트워크 또는 서버 오류", error);
    }
    throw error;
  }
};

export const setUpInterceptors = (logout: () => void): void => {
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
    async (error: AxiosError<ApiErrorPayload>) => {
      const originalRequest = error.config as
        | RetriableRequestConfig
        | undefined;

      if (
        error.response?.data.code === "0004" &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await reissueAccessToken(logout);
          authApi.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          return authApi(originalRequest);
        } catch (retryError) {
          console.error("토큰 재발급 실패", retryError);
          logout();
          return Promise.reject(retryError);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default authApi;
