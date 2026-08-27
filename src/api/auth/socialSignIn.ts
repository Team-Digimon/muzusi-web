import noAuthApi from "@/api/noAuthApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { SocialSignInData } from "@/types/auth";

type SocialPlatform = "KAKAO" | "NAVER";

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
