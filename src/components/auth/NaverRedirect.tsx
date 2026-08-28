import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "@/contexts/useAuth";
import socialSignIn from "@/api/auth/socialSignIn";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";

const NaverRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchNaverAccessToken = useCallback(
    async (code: string) => {
      try {
        const response = await socialSignIn("NAVER", code);
        login({ token: response.data.accessToken });
        if (response.data.isRegistered) {
          navigate("/");
        } else {
          navigate("/signup");
        }
      } catch (error) {
        console.error(
          "네이버 로그인 중 오류 발생:",
          error instanceof globalThis.Error ? error.message : error
        );
        setError(error);
      } finally {
        setIsLoading(false);
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

  if (isLoading) return <Loading />;
  if (error) return <Error />;
};

export default NaverRedirect;
