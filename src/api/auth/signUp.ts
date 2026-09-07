import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { SignUpData } from "@/types/auth";

/**
 * 닉네임을 받아 회원가입을 완료한다. 소셜 로그인(카카오/네이버)으로
 * 최초 인증에는 성공했지만 아직 서비스 가입은 안 된 사용자가,
 * 닉네임만 추가로 입력해 가입을 마무리하는 마지막 단계다.
 */
const signUp = async (
  nickname: string
): Promise<ApiEnvelope<SignUpData>> => {
  try {
    const response = await authApi.post<ApiEnvelope<SignUpData>>(
      `auth/sign-up`,
      { nickname }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default signUp;
