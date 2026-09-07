import axios, { type AxiosInstance } from "axios";
import { baseUrl } from "@/config/Env";

/**
 * 인증 토큰 없이 호출해야 하는 요청 전용 axios 인스턴스(로그인,
 * 토큰 재발급 등). `authApi`처럼 요청 인터셉터로 accessToken을
 * 자동으로 붙이지 않는다는 게 유일한 차이다.
 */
const noAuthApi: AxiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export default noAuthApi;
