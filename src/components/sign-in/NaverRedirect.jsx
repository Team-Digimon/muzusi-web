import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socialSignIn from "@/api/auth/socialSignIn";
import { useAuth } from "@/contexts/useAuth";

const NaverRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const fetchNaverAccessToken = useCallback(
    async (code) => {
      try {
        const response = await socialSignIn("NAVER", code);
        console.log("네이버 로그인 성공", response);

        login({ token: response.data.accessToken });

        if (response.data.isRegistered) {
          navigate("/");
        } else {
          navigate("/signup");
        }
      } catch (error) {
        console.error("네이버 로그인 중 오류 발생:", error.message);
      }
    },
    [navigate, login]
  );

  useEffect(() => {
    const queryPrams = new URLSearchParams(location.search);
    const code = queryPrams.get("code");

    if (code) {
      fetchNaverAccessToken(code);
    }
  }, [location, fetchNaverAccessToken]);
};

export default NaverRedirect;
