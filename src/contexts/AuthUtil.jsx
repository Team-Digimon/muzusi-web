export const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("로컬 스토리지에서 유저 데이터를 파싱하는 중 오류:", error);
    localStorage.removeItem("user");
    return null;
  }
};

export const getStoredToken = () => {
  try {
    return localStorage.getItem("accessToken");
  } catch (error) {
    console.error("로컬 스토리지에서 토큰을 읽는 중 오류:", error);
    localStorage.removeItem("accessToken");
    return null;
  }
};

export const decodeToken = (token) => {
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
    return JSON.parse(payload);
  } catch (error) {
    console.error("토큰 디코딩 중 오류 발생:", error);
    return null;
  }
};

export const getNicknameFromToken = (token) => {
  const decoded = decodeToken(token);
  return decoded ? decoded.nickname : null;
};

export const saveUserAndToken = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("accessToken", token);
};

export const clearStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
};
