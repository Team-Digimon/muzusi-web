import noAuthApi from "@/api/noAuthApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { SocialSignInData } from "@/types/auth";

type SocialPlatform = "KAKAO" | "NAVER";

/**
 * 카카오/네이버 OAuth 리다이렉트로 받은 인가 코드(`code`)를 서버에
 * 전달해 로그인 처리한다. `KakaoRedirect`/`NaverRedirect` 컴포넌트가
 * 콜백 URL에서 이 함수를 호출한다.
 */
const socialSignIn = async (
  platform: SocialPlatform,
  code: string
): Promise<ApiEnvelope<SocialSignInData>> => {
  try {
    const response = await noAuthApi.post<ApiEnvelope<SocialSignInData>>(
      `auth/sign-in/${platform}`,
      { code }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default socialSignIn;
