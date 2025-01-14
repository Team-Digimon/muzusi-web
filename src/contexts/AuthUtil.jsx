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

export const saveUserAndToken = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("accessToken", token);
};

export const clearStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
};
