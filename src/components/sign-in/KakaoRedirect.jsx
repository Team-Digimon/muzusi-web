import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import kakaoSignIn from "../../api/sign-in/kakaoSignIn";

const KakaoRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    const queryPrams = new URLSearchParams(location.search);
    const code = queryPrams.get("code");

    if (code) {
      fetchKakaoAccessToken(code);
    }
  }, [location]);

  const fetchKakaoAccessToken = async (code) => {
    try {
      const response = await kakaoSignIn(code);
      console.log("카카오 로그인 성공", response);
    } catch (error) {
      console.error("카카오 로그인 중 오류 발생:", error.message);
    }
  };
};

export default KakaoRedirect;