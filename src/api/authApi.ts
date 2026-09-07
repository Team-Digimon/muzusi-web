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

/**
 * 인증이 필요한 API 전용 axios 인스턴스. 로그인/토큰 재발급처럼
 * 인증 없이 호출해야 하는 요청은 `noAuthApi`를 대신 쓴다.
 */
const authApi: AxiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

/**
 * accessToken을 만료 응답(에러 코드 "0004")을 받았을 때 새로 발급받는다.
 * 재발급에 쓰는 리프레시 토큰 자체가 만료됐으면(에러 코드 "0008")
 * 재시도하지 않고 바로 로그아웃시킨다.
 */
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

/**
 * `authApi`에 요청/응답 인터셉터를 등록한다. 요청 시 sessionStorage의
 * accessToken을 자동으로 헤더에 붙이고, 토큰 만료 응답을 가로채
 * `reissueAccessToken`으로 재발급 후 원래 요청을 한 번 재시도한다.
 * `AuthProvider`가 마운트 시 한 번 호출해 등록한다.
 */
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
