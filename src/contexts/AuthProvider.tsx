import { useState, useEffect, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import AuthContext from "@/contexts/AuthContext";
import {
  getStoredUser,
  getStoredToken,
  saveUserAndToken,
  clearStorage,
  getNicknameFromToken,
} from "@/contexts/AuthUtil";
import type { User } from "@/types/auth";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();

    if (storedUser) setUser(storedUser);
    if (storedToken) {
      setAccessToken(storedToken);
      const nickname = getNicknameFromToken(storedToken);
      if (nickname) {
        setUser((prev) => (prev ? { ...prev, nickname } : { nickname }));
      }
    }
  }, []);

  const login = useCallback(
    ({ user, token }: { user?: Partial<User>; token: string }) => {
      // 실제 호출부는 전부 { token }만 넘기고 user는 안 준다(login 시그니처만
      // 확장 가능하게 열어둔 상태). 토큰 디코딩이 실패하는 극단적 케이스에
      // 대비해 nickname은 빈 문자열로 폴백한다.
      const nickname = getNicknameFromToken(token) ?? "";
      const nextUser: User = { ...user, nickname };
      setUser(nextUser);
      setAccessToken(token);
      saveUserAndToken(nextUser, token);
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    clearStorage();
    window.location.href = "/";
  }, []);

  const value = useMemo(
    () => ({ user, accessToken, login, logout }),
    [user, accessToken, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
