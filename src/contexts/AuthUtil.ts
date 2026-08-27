import type { User } from "@/types/auth";

// JWT payload. nickname 외 다른 표준 클레임(exp, iat 등)이 더 있을 수 있어
// 인덱스 시그니처로 열어둔다.
interface DecodedToken {
  nickname: string;
  [claim: string]: unknown;
}

export const getStoredUser = (): User | null => {
  try {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? (JSON.parse(storedUser) as User) : null;
  } catch (error) {
    console.error("세션 스토리지에서 유저 데이터를 파싱하는 중 오류:", error);
    sessionStorage.removeItem("user");
    return null;
  }
};

export const getStoredToken = (): string | null => {
  try {
    return sessionStorage.getItem("accessToken");
  } catch (error) {
    console.error("세션 스토리지에서 토큰을 읽는 중 오류:", error);
    sessionStorage.removeItem("accessToken");
    return null;
  }
};

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) throw new Error("유효하지 않은 토큰 구조");
    const base64 = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    const payload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
    return JSON.parse(payload) as DecodedToken;
  } catch (error) {
    console.error("토큰 디코딩 중 오류 발생:", error);
    return null;
  }
};

export const getNicknameFromToken = (token: string): string | null => {
  const decoded = decodeToken(token);
  return decoded ? decoded.nickname : null;
};

export const saveUserAndToken = (user: User, token: string): void => {
  sessionStorage.setItem("user", JSON.stringify(user));
  sessionStorage.setItem("accessToken", token);
};

export const clearStorage = (): void => {
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("stockData");
};
