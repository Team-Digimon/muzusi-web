import { createContext } from "react";
import type { User } from "@/types/auth";

export interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  login: (params: { user?: Partial<User>; token: string }) => void;
  logout: () => void;
}

// Provider 바깥에서 useAuth를 호출하는 실수를 잡아내기 위해 기본값은 undefined로 둔다.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default AuthContext;
