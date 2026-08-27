import { useContext } from "react";
import AuthContext, { type AuthContextValue } from "@/contexts/AuthContext";

const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth 불러오기 실패");
  }
  return context;
};

export default useAuth;
