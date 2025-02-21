import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "@/contexts/useAuth";
import socialSignIn from "@/api/auth/socialSignIn";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";

const KakaoRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchKakaoAccessToken = useCallback(
    async (code) => {
      try {
        const response = await socialSignIn("KAKAO", code);
        login({ token: response.data.accessToken });
        if (response.data.isRegistered) {
          navigate("/");
        } else {
          navigate("/signup");
        }
      } catch (error) {
        console.error("카카오 로그인 중 오류 발생:", error.message);
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
      fetchKakaoAccessToken(code);
    }
  }, [location, fetchKakaoAccessToken]);

  if (isLoading) return <Loading />;
  if (error) return <Error />;
};

export default KakaoRedirect;
