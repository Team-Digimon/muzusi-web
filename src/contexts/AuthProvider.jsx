import { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import AuthContext from "@/contexts/AuthContext";
import {
  getStoredUser,
  getStoredToken,
  saveUserAndToken,
  clearStorage,
  getNicknameFromToken,
} from "@/contexts/AuthUtil";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();

    if (storedUser) setUser(storedUser);
    if (storedToken) {
      setAccessToken(storedToken);
      const nickname = getNicknameFromToken(storedToken);
      if (nickname) {
        setUser((prev) => ({ ...prev, nickname }));
      }
    }
  }, []);

  const login = useCallback(({ user, token }) => {
    const nickname = getNicknameFromToken(token);
    setUser({ ...user, nickname });
    setAccessToken(token);
    saveUserAndToken({ ...user, nickname }, token);
  }, []);

  const logout = useCallback(() => {
    console.log("로그아웃 처리");
    setUser(null);
    setAccessToken(null);
    clearStorage();
  }, []);
  const value = useMemo(
    () => ({ user, accessToken, login, logout }),
    [user, accessToken, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
